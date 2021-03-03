import {useEffect, useState} from 'react';
import IssuesSelectionPanel from './IssuesSelectionPanel';
import IssueViewPanel from './IssueViewPanel';
import {Issue} from './Issue';
import Comment from './Comment';

import './index.css';

export default function App() {
  // All the Issues.
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | undefined>(
    undefined
  );
  const [comments, setComments] = useState<Comment[]>([]);

  const setSelectedIssueAndFetchComments = (issue: Issue) => {
    setSelectedIssue(issue);
    fetchComments(issue.comments_url);
    window.history.replaceState(null, '', String(issue.number));
  };

  useEffect(() => {
    fetch('https://api.github.com/repos/walmartlabs/thorax/issues').then(
      response => {
        response.json().then((response: Issue[]) => {
          if (response) {
            // Assuming that the larger the issue number, the more recent the issue is.
            response.sort((a: Issue, b: Issue) => b.number - a.number);
            // Store all the issues.
            setIssues(response);
            // Put the most recent issue in view.
            // Fetch comments for the issue in view.
            setSelectedIssueAndFetchComments(response[0]);
          }
        });
      }
    );
  }, []);

  /**
   * Fetches and sets the comment state.
   * @param commentsApi return all the comments.
   */
  const fetchComments = (commentsApi: string) => {
    if (!commentsApi) return;

    // Given a commentsAPI, return the comments.
    fetch(commentsApi).then(response => {
      response.json().then(response => {
        setComments(response);
      });
    });
  };

  return (
    <div className={'panels-container'}>
      <IssuesSelectionPanel
        allIssues={issues}
        setSelectedIssue={setSelectedIssueAndFetchComments}
        selectedIssue={selectedIssue}
      />
      <IssueViewPanel issue={selectedIssue} comments={comments} />
    </div>
  );
}
