# Sentiment.ly

> Twitter users analyzed, using the brains of IBM Watson's Tone Analyzer.
>
> Wouldn't it be great if there were a web app where you could "test drive" a social media post or text message and have IBM Watson's powerful sentiment analysis tool tell you how that text is likely to be perceived?
>
> Wouldn't you love it if you could run someone's tweets through Watson and find out how their expressed sentiments will ACTUALLY be perceived?
>
> Enter [*Sentiment.ly!*](http://sample-env.zhtjbs6sdb.us-west-2.elasticbeanstalk.com/)
>
***


## Our Team

  - __Product Owner__: [John Packel](https://twitter.com/jpackel)
  - __Scrum Master__: [Todd MacIntyre](https://twitter.com/toddmacintyre)
  - __Development Team Members__: [Andrew Fechner](https://twitter.com/AndrewFechner), [Aamir Yousuf](https://twitter.com/whyaamir), [Danny Hendrix](http://www.github.com/dhpdx), [Rich Serdici](https://github.com/ralexanderdesign), [Cameron Dunn](https://github.com/camdunne)


## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Team](#our-team)
1. [Contributing](#contributing)


## Usage

### Analyze a Twitter handle

#### Entering a valid twitter handle into the corresponding input field will:
  * Return to the user tone analysis from [IBM Watson](https://www.ibm.com/watson/)'s Sentiment analyzer over a range of 13 different categories by calculating average values of the user's last 50 tweets.
  * Dynamic graphical visualization using [d3](https://d3js.org/).
  * Add the search to the database and re-render.

### Test drive a tweet

#### Entering text into the test drive input field will:
  * Analyze the text as if it were a tweet by running it through IBM Watson's sentiment analyzer.
  * Displays dynamic [d3](https://d3js.org/) rendering for the individual tweet.


## Requirements

- Node 0.10.x
- bluebird 3.5.0
- body-parser" 1.17.1
- dotenv 4.0.0
- express 4.15.2
- mongoose 4.9.0
- morgan 1.8.1
- q 1.4.1
- watson-developer-cloud 2.25.1


## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

![See Sentiment.ly tech stack file above, since it apparently doesn't feel like loading here today](
https://cloud.githubusercontent.com/assets/19581802/24165435/c010acae-0e46-11e7-86bc-8379c48e81d1.png)

