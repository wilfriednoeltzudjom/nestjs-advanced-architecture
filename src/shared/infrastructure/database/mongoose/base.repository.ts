import { Connection, Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@Injectable()
export abstract class BaseMongooseRepository<T extends Document> {
  protected abstract readonly modelName: string;

  constructor(
    @InjectConnection() protected readonly connection: Connection,
    @InjectLogger() protected readonly logger: Logger,
  ) {
    this.logger.setContext(`${this.constructor.name}`);
  }

  protected get model(): Model<T> {
    return this.connection.model<T>(this.modelName);
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      this.logger.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName} by id ${id}:`, error);
      throw error;
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName}:`, error);
      throw error;
    }
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter).exec();
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName}s:`, error);
      throw error;
    }
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    } catch (error) {
      this.logger.error(`Error updating ${this.modelName} with id ${id}:`, error);
      throw error;
    }
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(filter, update, { new: true }).exec();
    } catch (error) {
      this.logger.error(`Error updating ${this.modelName}:`, error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      this.logger.error(`Error deleting ${this.modelName} with id ${id}:`, error);
      throw error;
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.findOneAndDelete(filter).exec();
      return !!result;
    } catch (error) {
      this.logger.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      this.logger.error(`Error counting ${this.modelName}s:`, error);
      throw error;
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter).exec();
      return !!result;
    } catch (error) {
      this.logger.error(`Error checking existence of ${this.modelName}:`, error);
      throw error;
    }
  }
}
