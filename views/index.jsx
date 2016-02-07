var React = require('react');
var DefaultLayout = require('./layouts/default');

var ListItemWrapper = React.createClass({
  render: function() {
    return (
      <li className="image-list-item">
        {this.props.data.date}
        <p>
          <img className="image-item" src={"https://s3.amazonaws.com/" + this.props.bucket + "/" + this.props.data.Key} />
        </p>
      </li>
    );
  }
});

var ImageList = React.createClass({
  render: function() {
    var bucket = this.props.data.bucket;
    return(
      <DefaultLayout title={this.props.title}>
        <ul className="image-list">
        {this.props.data.images.map(function(image) {
          return <ListItemWrapper key={image.Key} data={image} bucket={bucket}/>;
        })}
        </ul>
      </DefaultLayout>
    );
  }
});

module.exports = ImageList;
