var TwitchStreams = React.createClass({
  getInitialState: function(){
    return {
      streams: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "brunofin"],
      channels: [],
      missing: [],
      filtered: []
    }
  },
  componentDidMount: function(){
    var me = this;
    var result = [];
    var online;
    var user;
    this.state.streams.forEach(function(val){
      me.getData(val);
    });
  },
  getData: function(val){
        var me = this;
        online = true;
        user = val;
        var on = $.ajax({
          type: 'GET',
          dataType: "json",
          async: true,
          url: '/twitch/?type=streams&user=' + val,
          success: function(data) {
            var obj = JSON.parse(data);
            if(obj['stream'] === null){
              online = false;
              if(!online){
               $.ajax({
                  type: 'GET',
                  dataType: "json",
                  async: true,
                  url: '/twitch/?type=channels&user=' + val,
                  success: function(data2) {
                    var obj2 = JSON.parse(data2);
                    me.setState({
                      channels: me.state.channels.concat({
                        id: obj2["_id"],
                        name: obj2["display_name"],
                        status: "offline",
                        icon: obj2["logo"],
                        url: obj2["url"]
                      })
                    })
                    me.setState({
                      filtered: me.state.channels
                    })
                  }
                });
              }
            }
            else{
              online = true;
              if(obj["stream"] == null){
                  me.setState({
                    missing: me.state.missing.concat({
                      id: -1,
                      name: val,
                    })
                  })
                }
              else{
                  me.setState({
                    channels: me.state.channels.concat({
                      id: obj["stream"]["channel"]["_id"],
                      name: obj["stream"]["channel"]["display_name"],
                      status: obj["stream"]["channel"]["status"],
                      icon: obj["stream"]["channel"]["logo"],
                      url: obj["stream"]["channel"]["url"]
                    })
                  })
                }
              };
              me.setState({
                filtered: me.state.channels
              })
            }
        });
  },
  filterResults: function(e){
    var c = this.state.channels.filter(function(channel){
      return channel["name"].toLowerCase().includes(e.target.value.toLowerCase());
    })
    this.setState({
      filtered: c
    })
  },
  addUser: function(e){
    this.setState({
      streams: this.state.streams.concat(
        $("#newUser").val()
      )
    })
    console.log($("#newUser").val());
    this.getData($("#newUser").val());
  },
  render: function() {
    var c = this.state.filtered.map(function(channel){
      var displayStatus;
      if(channel["status"].length > 45){
        displayStatus = channel["status"].substring(0, 35) + "...";
      }
      else{
        displayStatus = channel["status"];
      }
      return (
        <li key={channel["id"]} className="listItem">
          <a href={channel["url"]}>
            <img src={channel["icon"]} className="logo"></img>
            <strong>{channel["name"]}</strong>
            <br/>
              <span className="abv">{displayStatus}</span>
          </a>
        </li>
      );
    })
    var m = this.state.missing.map(function(miss){
      return (
        <li key={miss["name"]}>
          <div className="alert alert-warning alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            User {miss["name"]} does not exist
          </div>
        </li>
        );
    });
    return (
      <div className="app">
        <div id="search" className="inner-addon">
          <span className="glyphicon glyphicon-search"></span>
          <input type="text" className="form-control" placeholder="Username" aria-describedby="sizing-addon1" onChange={this.filterResults}/>
        </div>
        <ul className="list">
          {c}
        </ul>
        <form id="add" className="input-group">
          <input id="newUser" type="text" className="form-control" placeholder="Username"/>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button" onClick={this.addUser} onSubmit={this.addUser}>Add User</button>
          </span>
        </form>
        <ul>
          {m}
        </ul>
      </div>
    );
  }
});

ReactDOM.render(<TwitchStreams />, document.getElementById('root'));
window.setTimeout(function() {
  $(".alert").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert").slideUp(500); 
  })
}, 5000);

$("#add").submit(function(e) {
    e.preventDefault();
});