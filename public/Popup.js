document.addEventListener("DOMContentLoaded", function () {
  const collectButton = document.getElementById("collect-problems");
  const openPageButton = document.getElementById("open-problem-page");

  // 문제 수집 버튼 클릭 시
  collectButton.addEventListener("click", async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      // contentScript.js가 주입되었는지 확인하고 주입
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ["contentScript.js"],
        },
        () => {
          // 주입 후 메시지 전송
          chrome.tabs.sendMessage(activeTab.id, { action: "collectProblems" });
        }
      );
    });
  });

  // 문제 페이지 열기 버튼 클릭 시
  openPageButton.addEventListener("click", () => {
    chrome.storage.local.get("unsolvedProblems", (data) => {
      const problems = data.unsolvedProblems || [];
      if (problems.length > 0) {
        chrome.tabs.create({ url: problems[0] }); // 첫 번째 문제 URL로 새 탭 열기
      } else {
        alert("풀지 않은 문제가 없습니다.");
      }
    });
  });
});
