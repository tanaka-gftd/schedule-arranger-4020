'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Comment= require('../models/comment');

router.post(
  '/:scheduleId/users/:userId/comments',
  authenticationEnsurer,
  async(req, res, next) => {
    const scheduleId = req.params.scheduleId;  //URLパラメータからscheduleIdを取得
    const userId = req.params.userId;  //URLパラメータからuserIdを取得
    const comment = req.body.comment;  //リクエストのボディから、コメントを取得

    //Commentのモデルを利用して、上記で取得したデータをDBに登録（or更新）していく
    await Comment.upsert({
      scheduleId: scheduleId,
      userId: userId,
      comment: comment.slice(0, 255)  //DBに合わせて、文字数はは255まででsliceする
    });
    res.json({ status: 'OK', comment: comment });
  }
);

module.exports = router;