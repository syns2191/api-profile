import { Inject, Injectable } from '@nestjs/common';
import { Model, startSession } from 'mongoose';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { ITechStack, ITechStackCategory, ITechStackFilter } from './interfaces/tech-stack.interface';

@Injectable()
export class TechStackService {
  constructor(
    @Inject('TECH_STACK_MODEL')
    private readonly techStackModel: Model<ITechStack>,
    @Inject('TECH_STACK_CATEGORY_MODEL')
    private readonly techStackCategoryModel: Model<ITechStackCategory>
  ) { }

  async create(createTechStack: CreateTechStackDto): Promise<ITechStack> {
    const session = await startSession();
    session.startTransaction();
    try {
      const createdUser = await this.techStackModel.findOneAndUpdate(
        { stackName: createTechStack.stackName },
        { $set: { stackName: createTechStack.stackName, stackIcon: createTechStack.stackIcon } },
        { upsert: true, session, new: true },
      );
      const stackCategory = createTechStack.categories.map((category: string) => ({
        updateOne: {
          filter: {
            category: category,
            stack: createdUser._id
          },
          update: { $set: { categoru: category, stack: createdUser._id } },
          upsert: true
        },
      }))
      await this.techStackCategoryModel.bulkWrite(stackCategory, { session });
      await session.commitTransaction();
      await session.endSession();
      return createdUser;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  async findOne(techStack: Partial<ITechStack>): Promise<ITechStack> {
    const stackData = await this.techStackModel.findOne({
      stackName: techStack.stackName
    });
    return stackData;
  }

  async findAll(techStackFilter: Partial<ITechStackFilter>): Promise<ITechStack[]> {
    const stackData = await this.techStackModel.find({
      stackName: { $regex: techStackFilter.stackName, $options: 'i' }
    }).limit(techStackFilter.limit).skip(techStackFilter.page * techStackFilter.limit)

    return stackData;
  }

  async findOneStackCategory(id: string): Promise<ITechStackCategory> {
    const stackDataCategory = await this.techStackCategoryModel.findOne({
      _id: id
    })
      .populate('stack')
      .populate('category');
    return stackDataCategory;
  }

  async updateOneStackCategory(id: string, createTechStack: CreateTechStackDto): Promise<ITechStack> {
    const stackCategory = await this.techStackCategoryModel.findOneAndUpdate(
      {_id: id},
      {$set: {
        category: createTechStack.category
      }}
    )
    const stack = await this.techStackModel.findOneAndUpdate(
      { _id: stackCategory.stack },
      {$set: {
        stackName: createTechStack.stackName,
        stackIcon: createTechStack.stackIcon
      }}
    )
    return stack;
  }

  async findStackCategory(techStackFilter: Partial<ITechStackFilter>): Promise<ITechStackCategory[]> {
    const stackCategory = await this.techStackCategoryModel.find()
      .limit(techStackFilter.limit)
      .skip(techStackFilter.page * techStackFilter.limit)
      .populate('category')
     .populate('stack')
    return stackCategory
  }

}
