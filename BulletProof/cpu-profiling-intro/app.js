Posts = new Mongo.Collection('posts');

if(Meteor.isServer) {
  var postCount = Posts.find().count();
  if(postCount < 300) {
    var insertCount = 300 - postCount;
    var bigStr = Random.id(999);
    for(var lc=0; lc<postCount; lc++) {
      Posts.insert({content: bigStr});
    }
  }

  Meteor.publish('posts', function() {
    return Posts.find();
  });


  // load testing myself
  createClinet();

  function createClinet() {
    var client = DDP.connect(process.env.ROOT_URL);
    client.subscribe('posts', function() {
      client.disconnect();
      createClinet();
    });
  }
}
