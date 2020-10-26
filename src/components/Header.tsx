import React from 'react';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="hero is-dark has-text-centered has-text-light">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
