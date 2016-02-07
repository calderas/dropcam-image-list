var React = require('react');

var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'/>
          <link rel="stylesheet" type="text/css" href="css/base-min.css" />
          <link rel="stylesheet" type="text/css" href="css/main.css" />
        </head>
        <body>
          <div className="content">
            {this.props.children}
          </div>
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;
