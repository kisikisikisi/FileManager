var X = XLSX;

// ファイル選択時のメイン処理
function handleFile(e) {

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
    var output = "";
    output = to_json(wb);// JSONが返ってくる
    // console.log(output);
    $("pre#result").html(JSON.stringify(output, null, 2));

    // $.ajax({
    //   url: "/sheetJS",
    //   type: "POST",
    //   data: {output: output},
    //   dataType: "JSON",
    //   cache: false,
    //   success: function(data){
    //     console.log("POST success");
    //   },
    //   error: function(XMLHttpRequest, textStatus, errorThrown){
    //     console.log("POST false");
    //     console.log("XMLHttpRequest : " + XMLHttpRequest.status);
    //     console.log("textStatus     : " + textStatus);
    //     console.log("errorThrown    : " + errorThrown.message);
    //   }
    // });



    // $("pre#result").html(JSON.stringify(output, null, 2));
    // $("#xlsx").val(output);
  };
  ///////

  ///////
  reader.readAsArrayBuffer(f);
}

// ファイルの読み込み
function fixdata(data) {
  var o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
    l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

// ワークブックのデータをjsonに変換
function to_json(workbook) {
  // var result = {};
  let sheetNameList = workbook.SheetNames;                       // シート名一覧オブジェクト
  let workSheet = workbook.Sheets[sheetNameList[0]];
  // let colNames = [workSheet['H4'].w,
  workSheet['I4'].w,
    workSheet['J4'].w,
    workSheet['K4'].w,
    workSheet['L4'].v,
    workSheet['M4'].v,
    workSheet['N4'].w,
    workSheet['O4'].w,
    workSheet['P4'].w;

  let endCol = workSheet['!ref'].match(/\:[A-Z+]([0-9]+)/)[1];  // エクセルデータの末端の行数を取得する
  workSheet['!ref'] = `H4:P${endCol}`;                          // 取得したいセルの範囲を指定し直す。H4からP列の末端行まで
  let workSheet_json = X.utils.sheet_to_json(workSheet);        // JSONオブジェクトとして取得

  return workSheet_json;
}

// 画面初期化
$(document).ready(function () {
  // ファイル選択欄 選択イベント
  // http://cccabinet.jpn.org/bootstrap4/javascript/forms/file-browser
  $('.custom-file-input').on('change', function (e) {
    handleFile(e);

    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
  })



  $("button#update").click(function (e) {
    // 多重送信を防ぐため通信完了までボタンをdisableにする
    var button = $(this);
    button.attr("disabled", true);

    // 各フィールドから値を取得してJSONデータを作成
    var data = getjson(e);
    console.log(data);

    // 通信実行
    // $.ajax({
    //   type: "post",                // method = "POST"
    //   url: "/sheetJS",        // POST送信先のURL
    //   data: {data: data},  // JSONデータ本体
    //   contentType: 'application/json', // リクエストの Content-Type
    //   dataType: "json",           // レスポンスをJSONとしてパースする
    //   success: function (json_data) {   // 200 OK時
    //     // JSON Arrayの先頭が成功フラグ、失敗の場合2番目がエラーメッセージ
    //     if (!json_data[0]) {    // サーバが失敗を返した場合
    //       alert("Transaction error. " + json_data[1]);
    //       return;
    //     }
    //     // 成功時処理
    //     location.reload();
    //   },
    //   error: function () {         // HTTPエラー時
    //     alert("Server Error. Pleasy try again later.");
    //   },
    //   complete: function () {      // 成功・失敗に関わらず通信が終了した際の処理
    //     button.attr("disabled", false);  // ボタンを再び enableにする
    //   }
    // });
  });

});


function getjson(e) {

  var result = JSON.parse(e.currentTarget.form.innerText.split(/[\[\]]/)[1]);
  console.log(typeof result);
  console.log(result);
  return result;
}