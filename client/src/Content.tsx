import React from 'react';

import './content.css';

type ContentProps = {
  path: string;
};

export const Content: React.FC<ContentProps> = props => {
  return (
    <div className="content">
      <p>Content asked for now at path: {props.path}</p>
    </div>
  );
};
