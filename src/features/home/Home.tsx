import React from 'react';

import Diaries from '../diary/Diaries';
import Editor from '../entry/Editor';


export default function Home() {
  return (
    <div className="two-cols" >
      <div className="left">
        <Diaries />
      </div>
      <div className="right">
        <Editor />
      </div>
    </div>
  );
}