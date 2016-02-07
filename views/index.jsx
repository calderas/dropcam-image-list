var React = require('react');
var DefaultLayout = require('./layouts/default');

var ListItemWrapper = React.createClass({
  render: function() {
    return (
      <li className="image-list-item">
        {this.props.data.date}
        <p>
          <img className="image-item" src={"https://s3.amazonaws.com/dropcam-image/" + this.props.data.Key} />
        </p>
      </li>
    );
  }
});

var ImageList = React.createClass({
  render: function() {
    return(
      <DefaultLayout title={this.props.title}>
        <ul className="image-list">
        {this.props.images.map(function(image) {
          return <ListItemWrapper data={image}/>;
        })}
        </ul>
      </DefaultLayout>
    );
  }
});

module.exports = ImageList;
