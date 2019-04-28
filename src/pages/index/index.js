import _ from 'lodash';
import './index.scss';

const div = document.createElement('div');

const compiled = _.template('hello <%= user %>!');
div.innerHTML = compiled({ 'user': 'fred' });
div.classList.add('blue');

document.body.appendChild(div);