function Queue(){
   this.queue = [];
}
 
Queue.prototype.enqueue = function(item){
   this.queue.push(item);
}
 
Queue.prototype.dequeue = function(){
   return this.queue.shift();
}
 
Queue.prototype.size = function(){
   return this.queue.length;
}
 
Queue.prototype.peak = function(){
   return (this.queue[0] !== null) ? this.queue[0] : null;
}