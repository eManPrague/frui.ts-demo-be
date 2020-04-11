import { Column, Entity, Index, PrimaryColumn, BaseEntity } from "typeorm";

@Entity({
  name: "sessions",
})
export class Session extends BaseEntity {
  @Index()
  @Column({ type: "timestamp" })
  expired_at: Date;

  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @Column("text")
  json: string;
}
