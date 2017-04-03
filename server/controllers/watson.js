var watson = require('watson-developer-cloud');
<<<<<<< HEAD
// Below functions required per IBM documentation
var tone_analyzer = watson.tone_analyzer({

  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
=======
// console.log('envVars.watson_username', envVars.watson_username); // to test that the env variables are exporting

// Below functions required per IBM documentation
var tone_analyzer = watson.tone_analyzer({

  username: process.env.watson_username,
  password: process.env.watson_password,
>>>>>>> feat(environment variables): add .env file
  version: 'v3',
  version_date: '2016-05-19'
});

exports.getTone = function (tweetString, callback) {
  tone_analyzer.tone({
    text: tweetString
  },
  function (err, tone) {
    // console.log(tone);
    if (err) {
      callback(err);
    } else {
      getAverage(tone);
      // console.log('watson.js getTone l 27. value of averageValues before callback = ', averageValues);
      callback(err, averageValues);
      // reset averageValues object for next search
      for (var key in averageValues) {
        averageValues[key].score = 0;
        averageValues[key].count = 0;
      }
    }
  });
}

// This object will be what is ultimately returned
var averageValues = {
  "Anger":{"score": 0,"count":0},
  "Disgust":{"score": 0,"count":0},
  "Fear":{"score": 0,"count":0},
  "Joy":{"score": 0,"count":0},
  "Sadness":{"score": 0,"count":0},
  "Analytical":{"score": 0,"count":0},
  "Confident":{"score": 0,"count":0},
  "Tentative":{"score": 0,"count":0},
  "Openness":{"score": 0,"count":0},
  "Conscientiousness":{"score": 0,"count":0},
  "Extraversion":{"score": 0,"count":0},
  "Agreeableness":{"score": 0,"count":0},
  "Emotional Range":{"score": 0,"count":0}
}

// This is the helper function that will calculate and assign values to the averageValues object
var getAverage = function (sentences) {
  console.log(sentences,'SENTENCES ERROR HERERERERE $$$$$$$$')
  if(sentences['sentences_tone'] === undefined){
    negateZero(sentences);
  } else {
    sentences['sentences_tone'].forEach(function(sentence){
    negateZero(sentence);
    })
  }
  // console.log(sentences['sentences_tone'][0].tone_categories, "herioioioioioioio");
  for (var key in averageValues) {
    averageValues[key]['score'] = Math.round(((averageValues[key].score / averageValues[key].count) + 0.00001)*100)/100;
  }
}

var negateZero = function(sentence){
  if(sentence.tone_categories === undefined){
    sentence.document_tone.tone_categories.forEach(function(tones){
      // console.log(tones,"tones909090909090");
      tones.tones.forEach(function(tone, index){
        // console.log(tone.score, tone.tone_name, "tonioioioi909090909090@@@");
        if(tone.score!==0 && tone.score!== undefined){
          averageValues[tone.tone_name].score += tone.score;
          averageValues[tone.tone_name].count +=1;
          // console.log(tone.score, tone.tone_name, "\n\nin watson.js negateZero, line 70. tonioioioi909090909090@@@");
        }
      })
    })
  } else {
    sentence.tone_categories.forEach(function(tones){
      tones.tones.forEach(function(tone, index){
        if(tone.score!==0 && tone.score!== undefined){
          averageValues[tone.tone_name].score += tone.score;
          averageValues[tone.tone_name].count +=1;
        }
      })
    })
  }

}

/* sample response

Math.round((num + 0.00001) * 100) / 100

Sentence Mode Category Access:
Emotion Tone
Anger  - results.sentences_tone[#].tone_categories[0].tones[0]  .score  .tone_name
Disgust - results.sentences_tone[#].tone_categories[0].tones[1]  .score  .tone_name
Fear - results.sentences_tone[#].tone_categories[0].tones[2]  .score  .tone_name
Joy - results.sentences_tone[#].tone_categories[0].tones[3]  .score  .tone_name
Sadness - results.sentences_tone[#].tone_categories[0].tones[4]  .score  .tone_name

Language Tone
Analytical - results.sentences_tone[#].tone_categories[1].tones[0]  .score  .tone_name
Content - results.sentences_tone[#].tone_categories[1].tones[1]  .score  .tone_name
Tentative - results.sentences_tone[#].tone_categories[1].tones[2]  .score  .tone_name

Social Tone
Openness - results.sentences_tone[#].tone_categories[2].tones[0]  .score  .tone_name
Conscientiousness - results.sentences_tone[#].tone_categories[2].tones[1]  .score  .tone_name
Extraversion - results.sentences_tone[#].tone_categories[2].tones[2]  .score  .tone_name
Agreeableness - results.sentences_tone[#].tone_categories[2].tones[3]  .score  .tone_name
Emotional Range - results.sentences_tone[#].tone_categories[2].tones[4]  .score  .tone_name


Document Mode Category Access:
Emotion Tone
Anger  - results.document-tone.tone_categories[0].tones[0]  .score  .tone_name
Disgust - results.document-tone.tone_categories[0].tones[1]  .score  .tone_name
Fear - results.document-tone.tone_categories[0].tones[2]  .score  .tone_name
Joy - results.document-tone.tone_categories[0].tones[3]  .score  .tone_name
Sadness - results.document-tone.tone_categories[0].tones[4]  .score  .tone_name

Language Tone
Analytical - results.document-tone.tone_categories[1].tones[0]  .score  .tone_name
Content - results.document-tone.tone_categories[1].tones[1]  .score  .tone_name
Tentative - results.document-tone.tone_categories[1].tones[2]  .score  .tone_name

Social Tone
Openness - results.document-tone.tone_categories[2].tones[0]  .score  .tone_name
Conscientiousness - results.document-tone.tone_categories[2].tones[1]  .score  .tone_name
Extraversion - results.document-tone.tone_categories[2].tones[2]  .score  .tone_name
Agreeableness - results.document-tone.tone_categories[2].tones[3]  .score  .tone_name
Emotional Range - results.document-tone.tone_categories[2].tones[4]  .score  .tone_name

{
  "document_tone": {
    "tone_categories": [
      {
        "tones": [
          {
            "score": 0.25482,
            "tone_id": "anger",
            "tone_name": "Anger"
          },
          {
            "score": 0.345816,
            "tone_id": "disgust",
            "tone_name": "Disgust"
          },
          {
            "score": 0.121116,
            "tone_id": "fear",
            "tone_name": "Fear"
          },
          {
            "score": 0.078903,
            "tone_id": "joy",
            "tone_name": "Joy"
          },
          {
            "score": 0.199345,
            "tone_id": "sadness",
            "tone_name": "Sadness"
          }
        ],
        "category_id": "emotion_tone",
        "category_name": "Emotion Tone"
      },
      {
        "tones": [
          {
            "score": 0.999,
            "tone_id": "analytical",
            "tone_name": "Analytical"
          },
          {
            "score": 0.999,
            "tone_id": "confident",
            "tone_name": "Confident"
          },
          {
            "score": 0.694,
            "tone_id": "tentative",
            "tone_name": "Tentative"
          }
        ],
        "category_id": "language_tone",
        "category_name": "Language Tone"
      },
      {
        "tones": [
          {
            "score": 0.271,
            "tone_id": "openness_big5",
            "tone_name": "Openness"
          },
          {
            "score": 0.11,
            "tone_id": "conscientiousness_big5",
            "tone_name": "Conscientiousness"
          },
          {
            "score": 0.844,
            "tone_id": "extraversion_big5",
            "tone_name": "Extraversion"
          },
          {
            "score": 0.257,
            "tone_id": "agreeableness_big5",
            "tone_name": "Agreeableness"
          },
          {
            "score": 0.497,
            "tone_id": "emotional_range_big5",
            "tone_name": "Emotional Range"
          }
        ],
        "category_id": "social_tone",
        "category_name": "Social Tone"
      }
    ]
  }
}

{
  "sentences_tone": [
    {
      "sentence_id": 0,
      "text": "I am happy and excited about today!",
      "input_from": 0,
      "input_to": 35,
      "tone_categories": [
        {
          "tones": [
            {
              "score": 0.014515,
              "tone_id": "anger",
              "tone_name": "Anger"
            },
            {
              "score": 0.007838,
              "tone_id": "disgust",
              "tone_name": "Disgust"
            },
            {
              "score": 0.021918,
              "tone_id": "fear",
              "tone_name": "Fear"
            },
            {
              "score": 0.902447,
              "tone_id": "joy",
              "tone_name": "Joy"
            },
            {
              "score": 0.071044,
              "tone_id": "sadness",
              "tone_name": "Sadness"
            }
          ],
          "category_id": "emotion_tone",
          "category_name": "Emotion Tone"
        },
        {
          "tones": [
            {
              "score": 0,
              "tone_id": "analytical",
              "tone_name": "Analytical"
            },
            {
              "score": 0,
              "tone_id": "confident",
              "tone_name": "Confident"
            },
            {
              "score": 0.681699,
              "tone_id": "tentative",
              "tone_name": "Tentative"
            }
          ],
          "category_id": "language_tone",
          "category_name": "Language Tone"
        },
        {
          "tones": [
            {
              "score": 0.022912,
              "tone_id": "openness_big5",
              "tone_name": "Openness"
            },
            {
              "score": 0.287448,
              "tone_id": "conscientiousness_big5",
              "tone_name": "Conscientiousness"
            },
            {
              "score": 0.60109,
              "tone_id": "extraversion_big5",
              "tone_name": "Extraversion"
            },
            {
              "score": 0.798373,
              "tone_id": "agreeableness_big5",
              "tone_name": "Agreeableness"
            },
            {
              "score": 0.006577,
              "tone_id": "emotional_range_big5",
              "tone_name": "Emotional Range"
            }
          ],
          "category_id": "social_tone",
          "category_name": "Social Tone"
        }
      ],
      "className": "original-text--sentence_joy-high"
    },
    {
      "sentence_id": 1,
      "text": "I'm so sick of this place.",
      "input_from": 36,
      "input_to": 62,
      "tone_categories": [
        {
          "tones": [
            {
              "score": 0.468076,
              "tone_id": "anger",
              "tone_name": "Anger"
            },
            {
              "score": 0.304047,
              "tone_id": "disgust",
              "tone_name": "Disgust"
            },
            {
              "score": 0.048258,
              "tone_id": "fear",
              "tone_name": "Fear"
            },
            {
              "score": 0.124049,
              "tone_id": "joy",
              "tone_name": "Joy"
            },
            {
              "score": 0.169382,
              "tone_id": "sadness",
              "tone_name": "Sadness"
            }
          ],
          "category_id": "emotion_tone",
          "category_name": "Emotion Tone"
        },
        {
          "tones": [
            {
              "score": 0,
              "tone_id": "analytical",
              "tone_name": "Analytical"
            },
            {
              "score": 0,
              "tone_id": "confident",
              "tone_name": "Confident"
            },
            {
              "score": 0,
              "tone_id": "tentative",
              "tone_name": "Tentative"
            }
          ],
          "category_id": "language_tone",
          "category_name": "Language Tone"
        },
        {
          "tones": [
            {
              "score": 0.103979,
              "tone_id": "openness_big5",
              "tone_name": "Openness"
            },
            {
              "score": 0.056544,
              "tone_id": "conscientiousness_big5",
              "tone_name": "Conscientiousness"
            },
            {
              "score": 0.25071,
              "tone_id": "extraversion_big5",
              "tone_name": "Extraversion"
            },
            {
              "score": 0.437816,
              "tone_id": "agreeableness_big5",
              "tone_name": "Agreeableness"
            },
            {
              "score": 0,
              "tone_id": "emotional_range_big5",
              "tone_name": "Emotional Range"
            }
          ],
          "category_id": "social_tone",
          "category_name": "Social Tone"
        }
      ],
      "className": "original-text--sentence_joy-low"
    }
  ]
}

*/
