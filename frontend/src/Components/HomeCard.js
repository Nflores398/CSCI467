import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function HomeCard(props) {
  return (
    <Card sx={{ maxWidth: `100%`, margin: 4 }}>
      <Link style={{ textDecoration: 'none' }} to={`/${props.label}`}>
        <CardMedia
          component="img"
          height="140"
          image={`/static/images/cards/${props.image}`}
          alt={props.alt}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is the {props.label} interface.
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
}
