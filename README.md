# trackbone
trackbone is a nodejs package to parse aws tags and control of AWS EC2 instance uptime.

[![Build Status](https://travis-ci.org/ventx/trackbone.svg?branch=master)](https://travis-ci.org/ventx/trackbone)

```
    #for cli usage (just launch "trackbone" in the cli): 
    npm install -g @ventx/trackbone
    
    # or just the package for your project:
    npm install @ventx/trackbone
```

```javascript
    const trackbone = require('@ventx/trackbone');
    let tb = new trackbone();
    tb.run();
    
```

## How can i use it?
The framework collects the tags of all instances running in an account and searches for the trackbone
tag ("trackbone", "Trackbone" or "TRACKBONE"). You should include it in your lambda function and trigger it regularly.
I suggest a 1 Minute interval so you can configure your instances uptime with a granularity of 1 minute.

For each instance there is an uptime schedule, which may be modified by the trackbone tag. 
Per default an instance uptime is defined as 24/7 up. With the content of the tag you may 
now take influence on the uptime schedule.  

Example:
```
@1+12:30-16:00|@2+17:00-17:05|Mo#1|Tu#1#2|We#2
```
The tag consists of an arbitrary number of commands, which are separated by a pipe symbol "|"  
Each command may be one of the following:
- schedule command
- uptime definition

### Uptime definition
An uptime definition first starts with an identifier after an @ followed by one or more time 
definitions. The identifier my consist of of upper and lowercase chars, numbers and underscores. 
Each time definition consists of a marker and a time. The marker may be + signaling
a start command or - signaling a stop command.

So the definition
```
@9_5_lunch+09:00-12:00+13:00-17:00
```
Will be available in the tag by the identifier **9_5_lunch** and signaling an uptime start at
9am and ending at 5pm with a downtime from 12pm to 1pm.  

### Schedule definition
A schedule definition starts with a weekday identifier (Mo, Tu, We, Th, Fr, Sa, Su) and 
multiple associated uptime definitions by 
\# + their identifier.
So let's take the previously defined **9_5_lunch** uptime definition and associate it with monday to friday.
```
Mo#9_5_lunch|Tue#9_5_lunch|We#9_5_lunch|Th#9_5_lunch|Fr#9_5_lunch|

```
This will order trackbone to launch the instance based on the 9_5_lunch schedule each day.
As you can see, those definitions can get quite long, so keep the uptime identifiers short.

### Example
So lets take the example from above:
```
@1+12:30-16:00|@2+17:00|@3-09:00|Mo#1#3|Fr#2
```
It defines three uptime definitions:  
1: Start the machine at 12:30 and stop it at 16:00
2: Start the machine at 17:00
3: Stop the machine at 09:00

Two days are associated with uptime definitions:  
Monday is associated with uptime 1 and 3.  
Friday is associated with uptime 2  

This means:
On Monday morning at 09:00 stop the machine. Start it again at 12:30 and stop it at 16:00. 
On Friday start it at 17:00.

### How does it work?
For each instance available, trackbone creates a 24/7 default up schedule. The uptime and 
schedule definitions are mapped upon this and therefore the correct uptime schedule is created.
The current state is evaluated and compared with the instance state. If the instance state doesn't
match the determined state, it is stopped or started. Be careful not to trigger too many instances
at once, so you don't hit the AWS API rate limit.  