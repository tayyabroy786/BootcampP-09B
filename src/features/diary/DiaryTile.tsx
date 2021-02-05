import React, { FC, useState } from 'react';
import { Diary } from '../../interfaces/diary.interface';
import http from '../../services/api';
import { updateDiary } from './diariesSlice';
import {
  setCanEdit,
  setActiveDiaryId,
  setCurrentlyEditing,
} from '../entry/editorSlice';
import { showAlert } from '../../util';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store';



interface Props {
  diary: Diary;
}

const DiaryTile: FC<Props> = (props) => {
  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const totalEntries = props.diary?.entryIds?.length;

  const saveChanges = () => {
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((diary) => {
        if (diary) {
          dispatch(updateDiary(diary));
          showAlert('Saved!', 'success');
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <div className="diary-tile">
      <div className='diary-2'>
        <h2
          title="Click to edit"
          onClick={() => setIsEditing(true)}
          style={{
            cursor: 'pointer',
          }}
        >
          {isEditing ? (
            <input
              value={diary.title}
              onChange={(e) => {
                setDiary({
                  ...diary,
                  title: e.target.value,
                });
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  saveChanges();
                }
              }}
            />
          ) : (
              <span>{diary.title}</span>
            )}
        </h2>
        <div className='sub-main'>
          <p className="subtitle">{totalEntries ?? '0'} saved entries</p>
        </div>
        <div className='diary-btn' >
          <button
            onClick={() => {
              dispatch(setCanEdit(true));
              dispatch(setActiveDiaryId(diary.id as string));
              dispatch(setCurrentlyEditing(null));
            }}
          >
            Add
        </button>
          <Link to={`diary/${diary.id}`}>
            <button className="secondary">
              View all
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiaryTile;
