# bomp
bomp! the html5 game engine developed by nommiin

# how to use
1. create an object using "Engine.Object.Create" and name it whatever you want! (ie: "oName")
2. setup events for the object by assigning a function to any of the event properties (ie: Create, Update, Render, etc)
3. create an instance of said object using "Engine.Instance.Create" and pass in the return of "Engine.Object.Create" or the name of the object
4. watch as the engine manages running all the events and stuff! incredible
5. destroy the instance by using "Engine.Instance.Destroy"