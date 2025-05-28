import Card, { CardProps } from './Card';

interface CardListProps {
  cardDetails: CardProps[];
  allow_percent?:boolean
}

const CardList: React.FC<CardListProps> = ({ cardDetails,allow_percent=true }) => {
  const cards = cardDetails.map((card, index) => (
    <Card key={index} {...card} allow_percent={allow_percent}/>
  ));
  return <>{cards}</>;
};

export default CardList;
