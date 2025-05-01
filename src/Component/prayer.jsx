import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function Prayer({ title,myImage,time }) {
  return (
    <Card style={ {borderRadius:"10px"}} sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        
              image={myImage}
              
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          {time}
        </Typography>
      </CardContent>
      <CardActions>
       
      </CardActions>
    </Card>
  );
}