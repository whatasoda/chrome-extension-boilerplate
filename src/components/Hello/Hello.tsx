import React, { FC } from 'react';
import cnb from 'classnames/bind';
import style from './Hello.scss';

const cn = cnb.bind(style);

const Hello: FC = () => <div className={cn('hello')}>Hello World.</div>;

export default Hello;
