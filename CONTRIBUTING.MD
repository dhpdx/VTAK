# Contributing Guidelines
##### Some basic conventions for contributing to this project.
### Linting
##### Please check your code using ```` npm run lint ```` before submitting your pull requests, as the CI build will fail if eslint fails.

### Commit Message Format
##### Each  commit message should include a type, a scope and a subject:
###### ```` <type>(<scope>): <subject> ````

##### Lines should not exceed 100 characters. This allows the message to be easier to read on github as well as in various git tools and produces a nice, neat commit log ie:
###### ````  #459  refactor(utils): create url mapper utility function ````
###### ```` #463  chore(webpack): update to isomorphic tools v2 ````
###### ```` #494  fix(babel): correct dependencies and polyfills ````
###### ```` #510  feat(app): add react-bootstrap responsive navbar ````
#### Subject
##### The subject contains succinct description of the change:

* Use the imperative, present tense: "change" not "changed" nor "changes"
* Don't capitalize first letter
* No dot (.) at the end

1. When you've finished with your fix or feature, Rebase upstream changes into your branch. submit a pull request directly to master. Include a description of your changes.
2. Your pull request will be reviewed by another maintainer. The point of code reviews is to help keep the codebase clean and of high quality and, equally as important, to help you grow as a programmer. If your code reviewer requests you make a change you don't understand, ask them why.
3. Fix any issues raised by your code reviwer, and push your fixes as a single new commit.
4. Once the pull request has been reviewed, it will be merged by another member of the team. Do not merge your own commits.

### Detailed Workflow
####
