import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import Markdown from 'markdown-to-jsx';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { Diary } from '../../interfaces/diary.interface';
import { setCurrentlyEditing, setCanEdit } from './editorSlice';
import { updateDiary } from '../diary/diariesSlice';
import { updateEntry } from './entriesSlice';
import { showAlert } from '../../util';
import { useAppDispatch } from '../../store';

const Editor: FC = () => {
  const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
    (state: RootState) => state.editor
  );

  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useAppDispatch();

  const saveEntry = async () => {
    if (activeDiaryId == null) {
      return showAlert('Please select a diary.', 'warning');
    }
    if (entry == null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entry/${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data != null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateDiary(diary));
          }
        });
    } else {
      http
        .put<Entry, Entry>(`diaries/entry/${entry.id}`, editedEntry)
        .then((_entry) => {
          if (_entry != null) {
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateEntry(_entry));
          }
        });
    }
    dispatch(setCanEdit(false));
  };

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  return (
    <div className="editor">
      <header className='editor-display'>
        {entry && !canEdit ? (
          <h4>
            {entry.title}
            <a
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                if (entry != null) {
                  dispatch(setCanEdit(true));
                }
              }}
            >
              (Edit)
            </a>
          </h4>
        ) : (
            <input
              placeholder='title'
              value={editedEntry?.title ?? ''}
              disabled={!canEdit}
              onChange={(e) => {
                if (editedEntry) {
                  updateEditedEntry({
                    ...editedEntry,
                    title: e.target.value,
                  });
                } else {
                  updateEditedEntry({
                    title: e.target.value,
                    content: '',
                  });
                }
              }}
            />
          )}
      </header>

      {entry && !canEdit ? (
        <Markdown>{entry.content}</Markdown>
      ) : (
          <>
            <textarea className='textArea'
              disabled={!canEdit}
              placeholder="Write here"
              value={editedEntry?.content ?? ''}
              onChange={(e) => {
                if (editedEntry) {
                  updateEditedEntry({
                    ...editedEntry,
                    content: e.target.value,
                  });
                } else {
                  updateEditedEntry({
                    title: '',
                    content: e.target.value,
                  });
                }
              }}
            />
            <div className='save-btn-div'>
              <button onClick={saveEntry} disabled={!canEdit}>
                Save
          </button>
            </div>
          </>
        )}
    </div>
  );
};

export default Editor;
