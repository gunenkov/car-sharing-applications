import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewApplicationInput } from './dto/new-application.input';
import { Application } from './models/application.model';
import { ApplicationsService } from './applications.service';
import { ApplicationsFilterInput } from './dto/applications-filter.input';

@Resolver((of) => Application)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query((returns) => [Application])
  async applications(): Promise<Application[]> {
    return await this.applicationsService.findAll();
  }

  @Query((returns) => [Application])
  async filterApplications(
    @Args()
    applicationsFilterData: ApplicationsFilterInput,
  ): Promise<Application[]> {
    return await this.applicationsService.findByFilter(applicationsFilterData);
  }

  @Mutation((returns) => Application)
  async addApplication(
    @Args('newApplicationData') newApplicationData: NewApplicationInput,
  ): Promise<Application> {
    const application = await this.applicationsService.create(
      newApplicationData,
    );
    return application;
  }
}
