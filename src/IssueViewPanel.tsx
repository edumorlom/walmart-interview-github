import ReactMarkdown from 'react-markdown';
import {Issue, Label} from './Issue';
import Comment from './Comment';
import User from './User';

export default function IssueViewPanel(props: {
  issue?: Issue;
  comments: Comment[];
}): JSX.Element {
  return (
    <div className={'panel issue-view-panel'}>
      {props.issue && (
        <>
          <h2 className={'title ' + props.issue.state}>
            {'Issue ' +
              props.issue.number +
              ' - ' +
              props.issue.state.toUpperCase()}
          </h2>
          <h3 className={'title'}>{props.issue.title}</h3>
          <LabelsView labels={props.issue.labels} />
          <CommentView
            isOriginalAuthor={true}
            user={props.issue.user}
            created_at={props.issue.created_at}
            body={props.issue.body}
          />
          {!!props.comments.length && <h3 className={'title'}>Comments</h3>}
          {props.comments.map((comment, i) => {
            return (
              <CommentView
                key={i}
                isOriginalAuthor={false}
                user={comment.user}
                created_at={comment.created_at}
                body={comment.body}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

/**
 * Returns a a commend div with the user's profile along the comment.
 * @param props isOriginalAuthor specifies if the comment is the opening issue.
 * along a User object, body of the comment and date the comment was created.
 */
function CommentView(props: {
  isOriginalAuthor: boolean;
  user: User;
  body: string;
  created_at: Date;
}): JSX.Element {
  const originalAuthorStyle = props.isOriginalAuthor ? 'original-author' : '';
  return (
    <div className={'comment ' + originalAuthorStyle}>
      <UserProfileComment user={props.user} created_at={props.created_at} />
      <div>
        <ReactMarkdown allowDangerousHtml>{props.body}</ReactMarkdown>
      </div>
    </div>
  );
}

/**
 * Returns a div with the user's profile picture, username and time the comment was written.
 * @param props a User object and a Date the comment was created
 */
function UserProfileComment(props: {
  user: User;
  created_at: Date;
}): JSX.Element {
  /**
   * Redirect to the user's Github page.
   */
  const goToUserGitHub = () => {
    window.location.href = 'https://github.com/' + props.user.login;
  };

  return (
    <div className={'user-profile'} onClick={goToUserGitHub}>
      <img className={'avatar'} src={props.user.avatar_url} />
      <div className="username">
        <h3>{'@' + props.user.login}</h3>
        <h6 className={'created-at'}>{props.created_at}</h6>
      </div>
    </div>
  );
}

/**
 * Returns a div with each label color coded.
 * @param props a list of Label objects for the issue.
 */
function LabelsView(props: {labels: Label[]}): JSX.Element {
  return (
    <div className="all-labels-container">
      {props.labels.map(label => {
        const colorHex = '#' + label.color;
        return (
          <div className={'label-container'}>
            <div style={{backgroundColor: colorHex}} className="label-dot" />
            <h4 style={{color: colorHex}}>{label.name}</h4>
          </div>
        );
      })}
    </div>
  );
}
