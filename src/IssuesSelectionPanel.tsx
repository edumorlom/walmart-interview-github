import {Issue} from './Issue';
import chunk from 'lodash.chunk';
import {useState} from 'react';

export default function Issues(props: {
  allIssues: Issue[];
  selectedIssue: Issue | undefined;
  setSelectedIssue: (issue: Issue) => void;
}): JSX.Element {
  // Keep track of what page the user is on in the pagination.
  const [currentPage, setCurrentPage] = useState<number>(0);
  // Keep track of any words the user has entered into the search query.
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter issues by the user's search query.
  const filteredIssues =
    filterIssueBySearchQuery(props.allIssues, searchQuery) || props.allIssues;

  // Divide the issues into chunks of MAX_ISSUES_TO_DISPLAY
  const MAX_ISSUES_TO_DISPLAY = 10;
  const chunkedIssues = chunk(filteredIssues, MAX_ISSUES_TO_DISPLAY);

  // Select the current chunk/page to show from the array of issues.
  const issuesInCurrentPage = chunkedIssues[currentPage] || [];

  // Function that updates the searchQuery any time user types something into array.
  const onSearchType = e => setSearchQuery(e.target.value);

  return (
    <div className={'issue-selection-panel'}>
      <input
        className={'panel search'}
        onChange={onSearchType}
        placeholder={'Search Issues'}
      />
      <div className={'panel'}>
        {issuesInCurrentPage.map(issue => (
          <IssueSelection
            key={issue.number}
            issue={issue}
            selected={issue === props.selectedIssue}
            onClick={() => {
              props.setSelectedIssue(issue);
            }}
          />
        ))}
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={chunkedIssues.length}
        />
      </div>
    </div>
  );
}

/**
 * Returns a div with multiple issues to select from.
 * @param props issue is an Issue object.
 * selected indicates whether the issue has been selected.
 * onClick will be called when the issue is clicked on.
 */
function IssueSelection(props: {
  issue: Issue;
  selected: boolean;
  onClick: () => void;
}): JSX.Element {
  // Sometimes title can be long, if it exceeds our desired length, shorten the title
  // and append ... at the end.
  let substringIssueTitle = props.issue.title;
  const MAX_TITLE_LENGTH = 70;
  if (substringIssueTitle.length >= MAX_TITLE_LENGTH) {
    substringIssueTitle = substringIssueTitle.substring(0, MAX_TITLE_LENGTH);
    substringIssueTitle += '...';
  }

  // Is the issue selected? If sow, display selection style.
  const isSelectedClassName = props.selected ? 'selected' : '';

  return (
    <div className={'selection ' + isSelectedClassName} onClick={props.onClick}>
      <h4 className={'title'}>
        <span className={props.issue.state}>{props.issue.number + '. '}</span>
        {substringIssueTitle}
      </h4>
    </div>
  );
}

/**
 *
 * @param props setCurrentPage modifies the pagination's index selection
 * currentPage is the page the index is on and totalPages is the max number of
 * pages that there are.
 */
function Pagination(props: {
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
}): JSX.Element {
  // Create an array of totalPages elements: [0, 1, 2, 3, 4, 5 ... totalPages].
  const allPageIndices = Array.from(Array(props.totalPages).keys());

  // For every page index, create a button.
  return (
    <div className={'pagination'}>
      {allPageIndices.map(pageIndex => (
        <button
          key={pageIndex}
          className={props.currentPage === pageIndex ? 'selected' : ''}
          onClick={() => props.setCurrentPage(pageIndex)}
        >
          {pageIndex + 1}
        </button>
      ))}
    </div>
  );
}

function filterIssueBySearchQuery(
  issues: Issue[],
  searchQuery: string
): Issue[] {
  // TODO(edumorales): find a more efficient way to sort so that it can also account for typos.
  return issues.filter(issue => {
    // Combine all strings into one, and search within that one string.
    const allContent =
      issue.title +
      issue.body +
      String(issue.number) +
      issue.user.login +
      issue.state;
    return allContent.includes(searchQuery);
  });
}
