import { Controller, Post, Get, Inject, Body, UseInterceptors, Query, ParseIntPipe, HttpCode } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

import Category from "./category.entity";
import CategoryService from "./category.service";
import { User as UserDecorator } from "../user/user.decorator";
import PaginatedSerializeInterceptor from "src/utils/paginated.interceptor";
import CategoryDto from "./category.dto";

@ApiTags("Category")
@Controller("categories")
export default class CategoryController {
  constructor(@Inject(CategoryService) private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: "List of categories" })
  @Get()
  @UseInterceptors(PaginatedSerializeInterceptor)
  @ApiResponse({ status: 200, description: "List of categories", type: Category })
  list(
    @Query("limit", new ParseIntPipe()) limit: number,
    @Query("offset", new ParseIntPipe()) offset: number,
    @UserDecorator("id") userId: number
  ) {
    return this.categoryService.list(userId, limit || 10, offset || 0);
  }

  @ApiOperation({ summary: "Create category" })
  @Post()
  @ApiResponse({ status: 201 })
  @HttpCode(201)
  create(@UserDecorator("id") userId, @Body() data: CategoryDto) {
    return this.categoryService.create(userId, data);
  }
}
