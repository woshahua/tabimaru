var express = require('express');
var router = express.Router();
const request = require('request');
const crypto = require("crypto");


const lineUrl = 'https://api.line.me/v2/bot/message/reply';
const jaranUrl = 'http://jws.jalan.net/APIAdvance/HotelSearch/V1/?key=peg15f82da666f&pref=470000&'
const lineChannelAccessToken = 'Iue9numLWTGn71xfsGrPf8AB3wmzOeOwAY7GEFdSmykC8rGvPELm5Hku8rNlXEr3KcAXAg7LBHPIkSK8DNRE1u8nT74qYvTJdA9sXAbYRW+BaCrmJSju+vR0+Ve5KiDp39u/cEhJF+0ycXROfH9vSgdB04t89/1O/w1cDnyilFU=';
const lineChannelSecret = '1c4097bd5c2687c4f7352ab1aacbd483';

const docomoApiKey = '5076435765446e3565537272546e6d41664262356851624a3554443063414a36334e374d30327064673030';
const jaranApiKey = 'peg15f82da666f'

const validate_signature = function(signature, body) {
  return signature == crypto.createHmac('sha256', lineChannelSecret).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64');
};


const User = require('../models/user');
const Destination = require('../models/destination');
const Purpose = require('../models/purpose');

var message;
var place;

var headers;
var options;

var dest;
var stay;
var budget;
var memberNum = 2;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




/* POST home page. */
router.post('/reply', function(req, res, next) {


  console.log('Reply Token: '+req.body.replytoken)

  let sendMessageObject;
  if(req.body.message=="ある"){
    sendMessageObject = [{
      type: 'text',
      text: "あなたの意見を教えてね！"
    }]; 
    Reply(sendMessageObject,req.body.replytoken)     
  }else if(req.body.message=="ない"){
    sendMessageObject = [{
      type: 'text',
      text: "この意見のなかから多数決をとろう"
      // 多数決機能
    }];
    Reply(sendMessageObject,req.body.replytoken)
  }else if(req.body.message=="2"){
    stay = req.body.message;
    sendMessageObject = [{
      type: 'text',
      text: "なるほどね・・予算はどのくらい？？"
    }];  
    Reply(sendMessageObject,req.body.replytoken)
  }else if(req.body.message=="50000"){
    budget = req.body.message;
    //行き先，予算，宿泊日数からapi叩く
    // var options = {
    //   url: jaranUrl+'stay_date=20171110&'+'stay_count='+stay+'&max_rate='+budget,
    //   json: true
    // };
  
    // request.get(options, function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body.PictureURL);
    //     console.log(body.PlanName);
    //   } else {
    //     console.log('error: '+ response.statusCode);
    //   }
    // });


    sendMessageObject = [{
      type: 'text',
      text: "いくつかいいホテルがあったよ!"
    },

    {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
          "type": "carousel",
          "columns": [
              {
                "thumbnailImageUrl": "https://cdn.jalan.jp/jalan/images/pictL/Y2/Y348492/Y348492118.jpg",
                "title": "ＪＲ九州ホテル　ブラッサム那覇",
                "text": "description",
                "actions": [
                    {
                      "type": "message",
                      "label": "ここにする！",
                      "text": "ＪＲ九州ホテル　ブラッサム那覇"
                    },
                    {
                        "type": "uri",
                        "label": "ホテル詳細",
                        "uri": "https://www.jalan.net/yad348492/?stayYear=2017&stayMonth=11&stayDay=10&stayCount=1&roomCount=1&adultNum=2&maxPrice=20000&rootCd=04&distCd=01&roomCrack=200000&screenId=UWW1402&yadNo=348492&callbackHistFlg=1"
                    }
                ]
              },
              {
                "thumbnailImageUrl": "https://www.jalan.net/jalan/images/pictM/Y2/Y355232/Y355232931.jpg",
                "title": "リッチモンドホテル那覇久茂地",
                "text": "description",
                "actions": [
                    {
                      "type": "message",
                      "label": "ここにする！",
                      "text": "リッチモンドホテル那覇久茂地"
                    },
                    {
                        "type": "uri",
                        "label": "ホテル詳細",
                        "uri": "https://www.jalan.net/yad355232/?screenId=UWW1402&distCd=01&rootCd=04&stayYear=2017&stayMonth=11&stayDay=10&stayCount=1&roomCount=1&maxPrice=20000&adultNum=2&roomCrack=200000&pageListNumArea=1_2&pageListNumYad=53_1_2&yadNo=355232&callbackHistFlg=1"
                    }
                ]
              }
          ]
      }
    }];
    Reply(sendMessageObject,req.body.replytoken)
  }else if(req.body.message == "ＪＲ九州ホテル　ブラッサム那覇" || req.body.message == "リッチモンドホテル那覇久茂地"){
    sendMessageObject = [{
      type: 'text',
      text: req.body.message + "だね！それじゃあここで予約しておくね！"
      // 沖縄のアイスのお店（ブルーシール）のサイトを紹介する
    },
    {
      type: 'text',
      text: "旅行中も何かあったらなんでも聞いてね！"
      // 沖縄のアイスのお店（ブルーシール）のサイトを紹介する
    }]; 
    Reply(sendMessageObject,req.body.replytoken) 

  }else if(req.body.message=="おいしいアイスが食べたいな"){
    sendMessageObject = [{
      type: 'text',
      text: "沖縄にあるおいしいアイスのお店を検索するよ"
      // 沖縄のアイスのお店（ブルーシール）のサイトを紹介する
    }]; 
    Reply(sendMessageObject,req.body.replytoken) 
  }else if(req.body.message==""){
    sendMessageObject = [{
      "type": "template",
      "altText": "this is a confirm template",
      "template": {
          "type": "confirm",
          "text": "どこか行きたいところや食べたいものはある？？？",
          "actions": [
              {
                "type": "message",
                "label": "ある",
                "text": "ある"
              },
              {
                "type": "message",
                "label": "ない",
                "text": "ない"
              }
          ]
      }
    }]; 
    Reply(sendMessageObject,req.body.replytoken)
  }else if(req.body.message=="たびまる。レンタカーを借りたい"){
      sendMessageObject = [{
        type: 'text',
        text: "りょうかいまる～～。レンタカーに関する情報を検索するよ"
        // 沖縄のレンタカーサイトを紹介する
      }]; 
      Reply(sendMessageObject,req.body.replytoken) 
    }else if(req.body.message=="旅行楽しかったね"){
      sendMessageObject = [{
        type: 'text',
        text: "旅行はどうだったかな。僕は＜ユーザーの名前＞と旅行ができてすっごく楽しかったよ。また行きたいな～～。今日はゆっくり休んでね。おやすみなさい。"
        // ユーザー名にアカウント名をいれる
      }]; 
      Reply(sendMessageObject,req.body.replytoken) 
  }else if(req.body.message=="卒業旅行"){　
    // ここはこうくんパート
    sendMessageObject = [
      {
        type: 'text',
        text: "卒業旅行のおすすめはここだよ！どこに行きたいか投票してね！"
      },
      {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
          "type": "carousel",
          "columns": [
            {
              "thumbnailImageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/99/Naha_Shuri_Castle16s5s3200.jpg",
              "title": "沖縄",
              "text": "ここがよかったら投票ボタンを押してね",
              "actions": [
                {
                  "type": "message",
                  "label": "投票",
                  "text": "沖縄"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Tokyo_Montage_2015.jpg/350px-Tokyo_Montage_2015.jpg",
              "title": "東京",
              "text": "ここがよかったら投票ボタンを押してね",
              "actions": [
                  
                  {
                      "type": "message",
                      "label": "投票",
                      "text": "東京"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://www.jalan.net/news/img/2015/11/20151104_006_redwest1.jpg",
              "title": "京都",
              "text": "ここがよかったら投票ボタンを押してね",
              "actions": [
                  
                  {
                      "type": "message",
                      "label": "投票",
                      "text": "京都"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://d18gmz9e98r8v5.cloudfront.net/ptr/20161020041008_685671886_10233_8.jpg",
              "title": "大阪",
              "text": "ここがよかったら投票ボタンを押してね",
              "actions": [
                  
                  {
                      "type": "message",
                      "label": "投票",
                      "text": "大阪"
                  }
              ]
            },
              {
                "thumbnailImageUrl": "https://file.veltra.com/jp/promotion/ctg_img/10072.jpg",
                "title": "北海道",
                "text": "ここがよかったら投票ボタンを押してね",
                "actions": [
                    
                    {
                        "type": "message",
                        "label": "投票",
                        "text": "北海道"
                    }
                ]
              }
              
          ]
      }
    }];
    Reply(sendMessageObject,req.body.replytoken)
  }else if(req.body.message == "北海道" || req.body.message == "沖縄" || req.body.message == "東京" || req.body.message == "大阪" || req.body.message == "京都"){
    Destination.find({'userid': req.body.userId},function(err,result){
      if (err) console.log(err);

      
      if (result.length == 0){
          var destination = new Destination();
  
          destination.userid = req.body.userId;
          destination.destination = req.body.message;
  
          destination.save(function(err){
            if (err) console.log(err);
          });

      }
      Destination.count(function(err,allDestNum){
        if(allDestNum == memberNum){
          sendMessageObject = [{
            type: 'text',
            text: "多数決取ったら沖縄に決まったよ！"
          },
          {
            type: 'text',
            text: "何泊する予定？"
          }];  
        }else{
          console.log('Hokkaido or Okinawa')
          sendMessageObject = [
            {
              type: 'text',
              text: "他の人はどうかな？"
            },
            {
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                  {
                    "thumbnailImageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/99/Naha_Shuri_Castle16s5s3200.jpg",
                    "title": "沖縄",
                    "text": "ここがよかったら投票ボタンを押してね",
                    "actions": [
                      {
                        "type": "message",
                        "label": "投票",
                        "text": "沖縄"
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Tokyo_Montage_2015.jpg/350px-Tokyo_Montage_2015.jpg",
                    "title": "東京",
                    "text": "ここがよかったら投票ボタンを押してね",
                    "actions": [
                        
                        {
                            "type": "message",
                            "label": "投票",
                            "text": "東京"
                        }
                    ]
                  },
                  {
                    "thumbnailImageUrl": "https://www.jalan.net/news/img/2015/11/20151104_006_redwest1.jpg",
                    "title": "京都",
                    "text": "ここがよかったら投票ボタンを押してね",
                    "actions": [
                        
                        {
                            "type": "message",
                            "label": "投票",
                            "text": "京都"
                        }
                    ]
                  },
                  {
                    "thumbnailImageUrl": "https://d18gmz9e98r8v5.cloudfront.net/ptr/20161020041008_685671886_10233_8.jpg",
                    "title": "大阪",
                    "text": "ここがよかったら投票ボタンを押してね",
                    "actions": [
                        
                        {
                            "type": "message",
                            "label": "投票",
                            "text": "大阪"
                        }
                    ]
                  },
                    {
                      "thumbnailImageUrl": "https://file.veltra.com/jp/promotion/ctg_img/10072.jpg",
                      "title": "北海道",
                      "text": "ここがよかったら投票ボタンを押してね",
                      "actions": [
                          
                          {
                              "type": "message",
                              "label": "投票",
                              "text": "北海道"
                          }
                      ]
                    }
                ]
            }
          }];
        }
        Reply(sendMessageObject,req.body.replytoken);
      })

    })
                
  }else{
    sendMessageObject = [{
      type: 'text',
      text: "Error"
    }];
  }


  console.log('at /reply '+req.body.message);
  console.log('at reply '+req.body.replytoken);


  // LINEへのReplyリクエスト作成
  console.log('test'+sendMessageObject[0].type);
  
  
});




function Reply(sendMessageObject,replytoken){
  let postDataStr = JSON.stringify({ replyToken: replytoken, messages: sendMessageObject });
  let options = {
    url: lineUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${lineChannelAccessToken}`,
      'Content-Length': Buffer.byteLength(postDataStr)
    },
    json: { replyToken: replytoken, messages: sendMessageObject }
  };

  // LINEへのReplyリクエスト発行
  request(options, function (error, response, body) {
    if (! error) {
      console.log("LINE Reply Success!");
      console.log(body);
    }
    else {
      console.log('in the error send LINE')
      console.log('error: ' + error.message);
      res.status(500);

      return null;
    }
  });
  //res.send('200');
}






router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next) {
  console.log("Webhook Accepted !");
  console.log(req.body.events[0]);
  // console.log(req.header);

  message = req.body.events[0].message.text;
  console.log(message);

  // signatureのvalidation
  //if (!validate_signature(req.headers['x-line-signature'], req.body)) {
  //  res.status(401);
  //  return null;
  //}

  let webhookEventObject = req.body.events[0];
  //メッセージが送られて来た場合
  if(webhookEventObject.type === 'message'){
    //メッセージを送ってきたユーザをDBに登録
    var userid = req.body.events[0].source.userId;
    User.find({'userid': userid},function(err,result){
      if (err) console.log(err);
      if (result.length == 0){
          var user = new User();
  
          user.userid = userid;
  
          user.save(function(err){
            if (err) console.log(err);
          });
        }
      console.log("test");

      //ヘッダーを定義
      headers = {
        'Content-Type':'application/json'
      }

      options = {
        url: 'http://13.112.109.240:3000/reply',
        method: 'POST',
        headers: headers,
        json: true,
        form: {"message":message,"replytoken":webhookEventObject.replyToken,"userId":userid}
      }

      request(options, function (error, response, body) {
        //コールバックで色々な処理
        //console.log(response);
        res.send('200');
      })


      
    })
  }
});

module.exports = router;
