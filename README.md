## Track Your Day
A react app to to track your daily activities!

### 1. Create tasks
Add title, description, select a color and hit save!

![image](https://user-images.githubusercontent.com/35102959/119669260-8bb00b80-be55-11eb-91b3-d9a626d16b3c.png)

### 2. Mark as Completed
You have to mark the task as complete whithin 24hrs of creation, else it will be marked as abandoned and moved to history!

![image](https://user-images.githubusercontent.com/35102959/119669715-e5183a80-be55-11eb-8dfa-398c9c7ec432.png)

### 3. Select multiple tasks by holding a task or clicking the tick button on hover.
You can delete multiple tasks like this or give selected tasks the same color.

![image](https://user-images.githubusercontent.com/35102959/119669931-17c23300-be56-11eb-8011-a8c58bd83f61.png)

### 4. Watch History and Analyze tab
The history tab will contain your completed and abandoned tasks. Tasks that are older than 7 days are not stored and are deleted permanently!
The Analyze tab has a chart to show your abandoned and completed tasks of the last 7 days in a graph.

![image](https://user-images.githubusercontent.com/35102959/119670235-59eb7480-be56-11eb-99dd-3894638768e9.png)


## Tech Stack:
  - **Frontend**: ReactJS, Material-ui, react-charts
  - **Backend**: Nodejs, Expess, Postgres for backend & database


Design mostly inspired from [Google Keep](https://keep.google.com)

First load may take time, max 30s, to wake heroku's app!
