// 풀지 않은 문제들의 URL을 저장할 배열
let allUnsolvedProblems = [];

// 현재 페이지에서 문제 리스트를 가져오는 함수
function getProblemsFromPage() {
  const problems = document.querySelectorAll("tr"); // 문제 목록을 감싸는 <tr> 태그 선택
  const unsolvedProblems = [];

  problems.forEach((problem) => {
    // 문제의 상태를 나타내는 <td> 태그의 클래스 확인
    const statusElement = problem.querySelector("td.status");

    // 만약 <td class="status unsolved">로 되어 있다면 풀지 않은 문제로 간주
    if (statusElement && statusElement.classList.contains("unsolved")) {
      const problemLink = problem.querySelector("td.title a"); // 문제의 링크를 포함한 <a> 태그 찾기
      if (problemLink) {
        unsolvedProblems.push(problemLink.href); // 문제의 URL 추가
      }
    }
  });

  return unsolvedProblems;
}

// 다음 페이지로 이동하는 함수
function goToNextPage() {
  const nextPageButton = document.querySelector(
    ".PaginationNavstyle__Arrow-sc-1ye3koq-3.next"
  ); // 다음 페이지 버튼 선택
  if (nextPageButton && !nextPageButton.disabled) {
    nextPageButton.click(); // 다음 페이지로 이동
    return true; // 페이지 이동 성공
  }
  return false; // 페이지 이동 실패
}

// 메시지 리스너 추가
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "collectProblems") {
    collectAllProblems();
  }
});

// 모든 문제를 수집하는 함수
async function collectAllProblems() {
  while (true) {
    const problemsOnPage = getProblemsFromPage(); // 현재 페이지에서 문제 수집
    allUnsolvedProblems.push(...problemsOnPage); // 수집된 문제를 배열에 추가

    const hasNextPage = goToNextPage(); // 다음 페이지로 이동
    if (!hasNextPage) break; // 더 이상 페이지가 없으면 루프 종료

    await new Promise((resolve) => setTimeout(resolve, 2000)); // 페이지 로딩 시간 대기
  }

  // 크롬 로컬 스토리지에 풀지 않은 문제 저장
  chrome.storage.local.set({ unsolvedProblems: allUnsolvedProblems }, () => {
    console.log("All unsolved problems saved.");
  });
}

// Content Script 실행 시 문제 수집 시작
collectAllProblems();
