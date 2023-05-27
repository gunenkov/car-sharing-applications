import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewApplicationInput } from './dto/new-application.input';
import { Application } from './models/application.model';
import { ApplicationsService } from './applications.service';

@Resolver((of) => Application)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query((returns) => [Application])
  applications(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  @Mutation((returns) => Application)
  async addApplication(
    @Args('newApplicationData') newRecipeData: NewApplicationInput,
  ): Promise<Application> {
    const recipe = await this.applicationsService.create(newRecipeData);
    return recipe;
  }
}
