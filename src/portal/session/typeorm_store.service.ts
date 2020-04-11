/*!
 * Connect - TypeORM
 * Copyright(c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2017, 2018 makepost <makepost@firemail.cc>
 * Copyright(c) 2018 Nathan Phillip Brink <ohnobinki@ohnopublishing.net>
 * MIT Licensed
 */

import * as Debug from "debug";
import { SessionOptions, Store } from "express-session";
import { Repository, MoreThan, LessThanOrEqual } from "typeorm";
import { Session } from "./session.entity";

/**
 * One day in seconds.
 */
const oneDay = 86400;

export type Ttl = number | ((store: TypeormStore, sess: any, sid?: string) => number);

export class TypeormStore extends Store {
  private cleanupLimit?: number;
  private debug = Debug("connect:typeorm");
  private limitSubquery = true;
  private ttl?: Ttl;

  /**
   * Initializes TypeormStore with the given `options`.
   */
  constructor(
    private repository: Repository<Session>,
    options: Partial<
      SessionOptions & {
        cleanupLimit: number;
        limitSubquery: boolean;
        ttl: Ttl;
      }
    > = {}
  ) {
    super(options);
    this.cleanupLimit = options.cleanupLimit;
    if (options.limitSubquery !== undefined) {
      this.limitSubquery = options.limitSubquery;
    }
    this.ttl = options.ttl;
  }

  /**
   * Attempts to fetch session by the given `sid`.
   */
  public get = (sid: string, fn: (error?: any, result?: any) => void) => {
    this.debug('GET "%s"', sid);

    this.createQueryBuilder()
      .andWhere("session.id = :id", { id: sid })
      .getOne()
      .then(session => {
        if (!session) {
          return fn();
        }

        this.debug("GOT %s", session.json);
        const result: any = JSON.parse(session.json);
        fn(undefined, result);
      })
      .catch(er => {
        fn(er);
        this.handleError(er);
      });
  };

  /**
   * Commits the given `sess` object associated with the given `sid`.
   */
  public set = (sid: string, sess: any, fn?: (error?: any) => void) => {
    let json: string;

    try {
      json = JSON.stringify(sess);
    } catch (er) {
      return fn ? fn(er) : undefined;
    }

    const ttl = this.getTTL(sess, sid);
    this.debug('SET "%s" %s ttl:%s', sid, json, ttl);

    (this.cleanupLimit
      ? (() => {
          const $ = this.repository
            .createQueryBuilder("session")
            .select("session.id")
            .where({ expired_at: LessThanOrEqual(new Date()) })
            .limit(this.cleanupLimit);
          return this.limitSubquery
            ? Promise.resolve($.getQuery())
            : $.getMany().then(xs =>
                xs.length
                  ? xs
                      .map(x => (typeof x.id === "string" ? `'${x.id.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'` : `${x.id}`))
                      .join(", ")
                  : "NULL"
              );
        })().then(ids =>
          this.repository
            .createQueryBuilder()
            .delete()
            .where(`id IN (${ids})`)
            .execute()
        )
      : Promise.resolve()
    )

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      .then(() =>
        this.repository.save({
          expired_at: new Date(Date.now() + ttl * 1000),
          id: sid,
          json,
        })
      )
      .then(() => {
        this.debug("SET complete");

        if (fn) {
          fn();
        }
      })
      .catch(er => {
        if (fn) {
          fn(er);
        }

        this.handleError(er);
      });
  };

  /**
   * Destroys the session associated with the given `sid`.
   */
  public destroy = (sid: string | string[], fn?: (error?: any) => void) => {
    this.debug('DEL "%s"', sid);

    Promise.all((Array.isArray(sid) ? sid : [sid]).map(x => this.repository.delete({ id: x })))
      .then(() => {
        if (fn) {
          fn();
        }
      })
      // tslint:disable-next-line: no-identical-functions
      .catch(er => {
        if (fn) {
          fn(er);
        }

        this.handleError(er);
      });
  };

  /**
   * Refreshes the time-to-live for the session with the given `sid`.
   */
  public touch = (sid: string, sess: any, fn?: (error?: any) => void) => {
    const ttl = this.getTTL(sess);

    this.debug('EXPIRE "%s" ttl:%s', sid, ttl);
    this.repository
      .createQueryBuilder()
      .update({ expired_at: new Date(Date.now() + ttl * 1000) })
      .whereInIds([sid])
      .execute()
      // tslint:disable-next-line: no-identical-functions
      .then(() => {
        this.debug("EXPIRE complete");

        if (fn) {
          fn();
        }
      })
      // tslint:disable-next-line: no-identical-functions
      .catch(er => {
        if (fn) {
          fn(er);
        }

        this.handleError(er);
      });
  };

  /**
   * Fetches all sessions.
   */
  public all = (fn: (error: any, result: any) => void) => {
    let result: any[] = [];

    this.createQueryBuilder()
      .getMany()
      .then(sessions => {
        result = sessions.map(session => {
          const sess = JSON.parse(session.json);
          sess.id = session.id;
          return sess;
        });

        fn(undefined, result);
      })
      .catch(er => {
        fn(er, result);
        this.handleError(er);
      });
  };

  private createQueryBuilder() {
    return this.repository.createQueryBuilder("session").where({ expired_at: MoreThan(new Date()) });
  }

  private getTTL(sess: any, sid?: string) {
    if (typeof this.ttl === "number") {
      return this.ttl;
    }
    if (typeof this.ttl === "function") {
      return this.ttl(this, sess, sid);
    }

    const maxAge = sess.cookie.maxAge;
    return typeof maxAge === "number" ? Math.floor(maxAge / 1000) : oneDay;
  }

  private handleError(er: Error) {
    this.debug("Typeorm returned err", er);
    this.emit("disconnect", er);
  }
}
