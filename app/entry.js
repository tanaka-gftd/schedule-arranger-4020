'use strict';
import $ from 'jquery';

//出欠ボタンを更新するための処理
$('.availability-toggle-button').each((i, e) => { //jQueryでclass名をもとにボタン要素を取得しつつ、 each関数（第一引数はインデックス、第二引数はHTML要素）で各ボタン要素に対して実行する関数を渡す
  const button = $(e);  //each関数の引数から受け取ったjQueryオブジェクト（ボタン要素）を格納

  //ボタン要素がクリックされた時に実行される関数
  button.on('click', () => {

    //jQueryのdata関数を使用して、各data-*属性を取得
    const scheduleId =button.data('schedule-id');  //予定ID
    const userId = button.data('user-id');  //ユーザID
    const candidateId = button.data('candidate-id');  //候補ID
    const availability = parseInt(button.data('availability'));  //出席（文字列から数値に変換しておく）

    //次の出席の数値
    //0 → 1 → 2 → 0 → 1 → 2 と循環させたいので、 1を足して3の剰余を次の出欠の数値とする
    const nextAvailability = (availability + 1) % 3;

    //出欠更新のwebAPIを呼び出し、実行結果を受け取って、button要素のdata-*属性を更新し、ボタンのラベルを更新する
    $.post(`/schedules/${scheduleId}/users/${userId}/candidates/${candidateId}`,
      { availability: nextAvailability },
      (data) => {
        button.data('availability', data.availability);
        const availabilityLabels = ['欠席','?','出席'];
        button.text(availabilityLabels[data.availability]);
      }
    );
  }); 
});