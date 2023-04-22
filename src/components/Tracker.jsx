import React from 'react';
import Table from './Table.jsx';
import _ from 'lodash';
import moment from 'moment';

export default class Tracker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        date: {
          value: '',
          validation: 'invalid',
        },
        distance: {
          value: '',
          validation: 'invalid',
        },
      },
      tableRecords: [
        { id: 'asdjj', date: '11.05.2022', distance: 3 }
      ],
    };
  }

  formatDate = (date) => date.split('.').reverse().join('-');

  isValidValue = (type, value) => {
    switch(type) {
      case 'date':
        return moment(this.formatDate(value)).isValid() ? 'valid' : 'invalid';
      case 'distance':
        return Math.sign(Number(value)) === 1 ? 'valid' : 'invalid';
      default:
        return;
    }
  };

  handleChange = ({ target }) => {
    const { value, id } = target;
    this.setState(({ form, tableRecords }) => (
      { form: {
        ...form,
        [id]: {
          value,
          validation: this.isValidValue(id, value),
        },
      }, tableRecords }
    ));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, tableRecords } = this.state;
    const { date, distance } = form;
    const validation = date.validation === 'valid' && distance.validation === 'valid';

    if (validation) {
      const dateRecord = _.find(tableRecords, ['date', date.value]) ?? {
        id: _.uniqueId(),
        date: date.value,
        distance: 0,
      };
      const newTableRecords = _.without(tableRecords, dateRecord);
      const record = _.set(dateRecord, 'distance', dateRecord.distance + Number(distance.value));
      newTableRecords.push(record);
      newTableRecords.sort((rec1, rec2) => (
        moment(this.formatDate(rec1.date)).isBefore(this.formatDate(rec2.date))
      ));

      this.setState({
        form: {
          date: {
            value: '',
            validation: 'invalid',
          },
          distance: {
            value: '',
            validation: 'invalid',
          },
        },
        tableRecords: newTableRecords, 
      });
    }
  };

  deleteRecord = (id) => () => {
    this.setState(({ form, tableRecords }) => {
      const newRecords = tableRecords.filter((record) => record.id !== id);

      return { form, tableRecords: newRecords };
    });
  };

  editRecord = (id) => () => {
    this.setState(({ tableRecords }) => {
      const selected = _.find(tableRecords, ['id', id]);
      const { date, distance } = selected;
      const newRecords = _.without(tableRecords, selected);

      return { form: {
        date: {
          value: date,
          validation: 'valid',
        },
        distance: {
          value: distance,
          validation: 'valid',
        }
      }, tableRecords: newRecords };
    }); 
  };

  render() {
    const { form, tableRecords } = this.state;
    const { date, distance } = form;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="date">
            Дата (ДД.ММ.ГГ)          
            <input id="date" className={date.validation} value={date.value} onChange={this.handleChange} />
          </label>
          <label htmlFor="distance">
            Пройдено км
            <input id="distance" className={distance.validation} value={distance.value} onChange={this.handleChange} />
          </label>
          <button className="submit" type="submit">
            ОК
          </button>
        </form>
        <Table records={tableRecords} onDeleteRecord={this.deleteRecord} onEditRecord={this.editRecord} />
      </div>
    );
  }
}
