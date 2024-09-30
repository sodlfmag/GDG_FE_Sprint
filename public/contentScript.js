// 풀지 않은 문제들의 URL을 저장할 배열
let allUnsolvedProblems = [];

// 현재 페이지에서 문제 리스트를 가져오는 함수
function getProblemsFromPage() {
  const problemRows = document.querySelectorAll("tr"); // 문제 목록을 감싸는 <tr> 태그 선택

  const unsolvedProblems = [];

  problemRows.forEach((row) => {
    const statusElement = row.querySelector("td.status"); // 문제의 상태를 나타내는 td 태그 찾기

    // 상태가 'unsolved'인 문제만 선택
    if (statusElement && statusElement.classList.contains("unsolved")) {
      const problemLink = row.querySelector("td.title a"); // 문제의 링크를 포함한 <a> 태그 찾기
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
    "button.PaginationNavstyle__Arrow-sc-1ye3koq-3.drGwOp.next" // 다음 페이지 버튼 선택
  );

  // 다음 페이지 버튼이 비활성화되어 있는지 확인
  if (nextPageButton && !nextPageButton.disabled) {
    nextPageButton.click(); // 다음 페이지로 이동
    return true;
  }
  return false;
}

// 페이지 로드 완료를 확인하는 함수
function waitForPageLoad() {
  return new Promise((resolve) => {
    const checkLoaded = setInterval(() => {
      // 페이지가 완전히 로드되었는지 확인하는 조건
      if (document.querySelector("tr")) {
        // 예시: <tr> 태그가 존재하면 페이지가 로드된 것으로 간주
        clearInterval(checkLoaded); // 로드 완료 시 interval 종료
        resolve(); // Promise 해결
      }
    }, 500); // 0.5초마다 체크
  });
}

// 모든 문제를 수집하는 함수
async function collectAllProblems() {
  console.log("Collecting problems..."); // 함수 시작 시 로그

  while (true) {
    // 현재 페이지에서 문제 수집
    const problemsOnPage = getProblemsFromPage();
    console.log("Problems on page:", problemsOnPage); // 수집된 문제 로그
    allUnsolvedProblems.push(...problemsOnPage); // 수집된 문제를 배열에 추가

    const hasNextPage = goToNextPage(); // 다음 페이지로 이동
    console.log("Has next page:", hasNextPage); // 다음 페이지 여부 로그

    // 페이지 로드 완료 대기
    await waitForPageLoad();

    // 더 이상 페이지가 없으면 루프 종료
    if (!hasNextPage) break;
  }

  // 크롬 로컬 스토리지에 풀지 않은 문제 저장
  chrome.storage.local.set({ unsolvedProblems: allUnsolvedProblems }, () => {
    console.log("All unsolved problems saved.");
  });
}

// 문제 수집 시작
collectAllProblems();
