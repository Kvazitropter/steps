import React from 'react';

const Table = (props) => {
  const { records, onDeleteRecord, onEditRecord } = props;

  return (
    <table>
      <thead>
        <tr>
          <th>Дата (ДД.ММ.ГГ)</th>
          <th>Пройдено км</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {records.map(({ id, date, distance }) => (
          <tr key={id}>
            <td>{date}</td>
            <td>{distance}</td>
            <td>
              <div className="material-icons action" onClick={onEditRecord(id)}>edit</div>
              <div className="material-icons action" onClick={onDeleteRecord(id)}>clear</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
