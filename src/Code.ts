const MANAGE_SHEET = "★いじっちゃダメ★";
const SHOPPING_LIST_SHEET = "お買い物リスト";

function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
	// お買物シート以外の編集は無視
	if(e.source.getSheetName() != SHOPPING_LIST_SHEET) {
		return;
	}

	// Line通知トークンの取得
	const manageSheet = SpreadsheetApp.getActiveSpreadsheet()
													.getSheetByName(MANAGE_SHEET);
	const token = manageSheet.getRange(1, 2).getValue().toString();

	// 編集行の取得
	const editedSheet = e.source.getActiveSheet();
	const editedRow = e.range.getRow();

	const editedYear = editedSheet.getRange(editedRow, 1).getDisplayValue();
	const editedDay = editedSheet.getRange(editedRow, 2).getDisplayValue()
	const editedProductName = editedSheet.getRange(editedRow, 3).getDisplayValue();
	const editedPayment = editedSheet.getRange(editedRow, 4).getDisplayValue();

	// 編集行の何かしらがまだ埋まっていない場合、通知はしないで終了
	if(!editedYear || !editedDay || !editedProductName || !editedPayment) {
		return;
	}
	const newOrDelete = e.oldValue?"編集":"追加";

	const content = `お買い物リストが${newOrDelete}されました。\n${editedYear}/${editedDay} ${editedProductName} ${editedPayment}`

	const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
		"method"  : "post",
		"payload" : {"message": content,}, 
		"headers" : {"Authorization" : "Bearer "+ token}
	};
	UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
