export class CreateProjectDto {
  readonly projectTitle: string;
  readonly prejectShortDescription: string;
  readonly projectImage: string;
  readonly projectDemoLink: string;
  readonly projectCodeLink: string;
  readonly projectTeachStack: string[];
}
