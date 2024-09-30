document.addEventListener("DOMContentLoaded", function () {
  const collectButton = document.getElementById("collect-problems");
  const openPageButton = document.getElementById("open-problem-page");

  // 문제 수집 버튼 클릭 시
  collectButton.addEventListener("click", async () => {
    // contentScript.js에 메시지 보내기
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "collectProblems" });
    });
  });

  // 문제 페이지 열기 버튼 클릭 시
  openPageButton.addEventListener("click", () => {
    // 크롬 로컬 스토리지에서 문제 URL 가져오기
    chrome.storage.local.get("unsolvedProblems", (data) => {
      const problems = data.unsolvedProblems || [];
      if (problems.length > 0) {
        // 첫 번째 문제 URL로 새 탭 열기
        chrome.tabs.create({ url: problems[0] });
      } else {
        alert("풀지 않은 문제가 없습니다.");
      }
    });
  });
});
