var X = XLSX;
var output = "";
var fileName = "";
var projectName = "";
var button = $("button#update");


// ファイル選択時のメイン処理
function handleFile(e) {
  // console.log(e)
  var files = e.target.files;
  var f = files[0];

  var reader = new FileReader();
  reader.onload = function (e) {
    var data = e.target.result;
    var wb;
    var arr = fixdata(data);
    wb = X.read(btoa(arr), {
      type: 'base64',
      cellDates: true,
    });
    console.log(wb)
    output = to_json(wb);// JSONが返ってくる
    console.log(output)

  };


  reader.readAsArrayBuffer(f);
}

// ファイルの読み込み
function fixdata(data) {
  var o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

// ワークブックのデータをjsonに変換
function to_json(workbook) {
  if (fileName.indexOf('_案件一覧') === -1) {
    console.log('ファイル形式が一致しません');
    button.attr("disabled", true);
    $('.not-fileName').html('ファイル形式が一致しません');
    return;
  }
  projectName = fileName.split('_')[0];
  button.attr("disabled", false);

  let sheetNameList = workbook.SheetNames;                       // シート名一覧オブジェクト
  let workSheet = workbook.Sheets[sheetNameList[0]];
  let colNames = [
    workSheet['C4'].v,
    workSheet['D4'].w,
    workSheet['E4'].w,
    workSheet['F4'].w,
    workSheet['G4'].w,
    workSheet['H4'].w,
    workSheet['I4'].w,
    workSheet['J4'].w,
    workSheet['K4'].w,
    workSheet['L4'].v,
    workSheet['M4'].v,
    workSheet['N4'].w,
    workSheet['O4'].w,
    workSheet['P4'].w
  ];

  let endCol = workSheet['!ref'].match(/\:[A-Z+]([0-9]+)/)[1];  // エクセルデータの末端の行数を取得する
  workSheet['!ref'] = `C4:P${endCol}`;                          // 取得したいセルの範囲を指定し直す。H4からP列の末端行まで
  // console.log(Object.keys(workSheet));
  let maxNum = 0;
  const newArray = Object.keys(workSheet).filter(element => (element.match(/^[C-P]\d+$/)));
  for (let i = 0; i < newArray.length; i++) maxNum = Math.max(maxNum, Number(newArray[i].slice(1)));

  // パディング
  for (let i = 5; i <= maxNum; i++) {
    if (!("G" + i in workSheet)) workSheet["G" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };
    if (!("H" + i in workSheet)) workSheet["H" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };
    if (!("I" + i in workSheet)) workSheet["I" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };
    if (!("J" + i in workSheet)) workSheet["J" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };
    if (!("K" + i in workSheet)) workSheet["K" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };
    if (!("L" + i in workSheet)) workSheet["L" + i] = workSheet["C5"]; // 対応予定日が空の場合、記入日を入れておく
    if (!("M" + i in workSheet)) workSheet["M" + i] = workSheet["C5"]; // 完了日が空の場合、記入日を入れておく
    if (!("N" + i in workSheet)) workSheet["N" + i] = { t: "n", v: 0, w: "0" };
    if (!("O" + i in workSheet)) workSheet["O" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };
    if (!("P" + i in workSheet)) workSheet["P" + i] = { t: "s", v: "-", r: '<t>-</t><phoneticPr fontId="10"/>', h: "-", w: "-" };

    if (i > 5) {
      if (!("C" + i in workSheet)) workSheet["C" + i] = workSheet["C" + (i - 1)];
      if (!("D" + i in workSheet)) workSheet["D" + i] = workSheet["D" + (i - 1)];
      if (!("E" + i in workSheet)) workSheet["E" + i] = workSheet["E" + (i - 1)];
      if (!("F" + i in workSheet)) workSheet["F" + i] = workSheet["F" + (i - 1)];
    }
  }
  console.log(workSheet);

  let workSheet_json = X.utils.sheet_to_json(workSheet);        // JSONオブジェクトとして取得
  console.log(workSheet_json);
  return workSheet_json;
}


// 画面初期化
$(document).ready(function () {
  // ファイル選択欄 選択イベント
  // http://cccabinet.jpn.org/bootstrap4/javascript/forms/file-browser
  $('.custom-file-input').on('change', function (e) {
    handleFile(e);
    fileName = $(this)[0].files[0].name;

    ////////////getでDBになかったやつを返してくれるnodeのjsにアクセス////////
    //ajaxでget，nodeでDBに検索をかけて，DBに存在しないものをreturn
    //帰ってきたらその行の数tableをappendして増やす
    // console.log(output);
    // console.log(fileName);
    // console.log(output.length);
    // for (let i = 0; i < output.length; i++) {
    //   //テーブルの行を追加する式
    //   $('#tbl1').append('<tr><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td><td>' + '-'
    //       + '</td></tr>'
    //   );
    // }
    // $.ajax({
    //   type: "get",
    //   url: "#",
    //   data: {
    //     output: output,
    //     projectName: projectName
    //   },
    //   dataType: "json"
    // }).then(
    //   //第一引数が通信成功時の処理　第二引数が通信失敗時の処理
    //   data => {
    //     for (let i = 0; i < data.length; i++) {
    //       //テーブルの行を追加する式
    //       $('#tbl1').append('<tr><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td><td>' + '-'
    //           + '</td></tr>'
    //       );
    //     }
    //   },
    //   error => alert('読み込み失敗')
    // );

    ///////////////////////////ここまで/////////////////////////////////
  })



  $("button#update").click(function (e) {
    console.log($("#status").val())
    if ($("#customFile").val().length == 0 ){
      $('.not-fileName').html('【エラー】ファイルが選択されていませんん');
    }else if ($("#status").val().length == 0 ){
      $('.not-fileName').html('【エラー】承認依頼先が指定されていません');
    }else{
      $('.not-fileName').html('アップロードが完了しました。');
      // 多重送信を防ぐため通信完了までボタンをdisableにする
      button.attr("disabled", true);
      button.attr("style", "background-color:#cccccc");
      status = $("input[name='status'").val();
      // 各フィールドから値を取得してJSONデータを作成
      console.log(output);
      $.ajax({
        url: "/upload",
        type: "POST",
        data: {
          output: output,
          projectName: projectName,
          status: status
        },
        dataType: "JSON",
        cache: false,
        success: function (data) {
          console.log("POST success");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("POST false");
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
          console.log("errorThrown    : " + errorThrown.message);
        },
        complete: function () {      // 成功・失敗に関わらず通信が終了した際の処理
          button.attr("disabled", false);  // ボタンを再び enableにする
          button.attr("style", "background-color:#ffffff");
        }
      });
    }
  });

});

