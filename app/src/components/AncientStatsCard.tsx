import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from './ui/separator'

type AncientInfoBoxProps = {
  title: string;
  image: string;
  wins: number;
  losses: number;
  bg: string;
}

function AncientStatsCard({ title, image, wins, losses, bg }: AncientInfoBoxProps) {


  return (
    <Card className={`${bg} flex flex-col h-full pt-2 pb-2 border border-white gap-1 inset-shadow-sm inset-shadow-amber-400`}>
      <CardHeader className='relative'>
        <img src={image} alt="Character Icon" className='absolute left-2 top-0.5 w-6 h-6 rounded-full drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)]' />
        <div className='w-full text-center mb-0'>
          <h2 className='text-2xl font-bold'>{title}</h2>
        </div>
      </CardHeader>
      <Separator className='p-0 m-0 bg-white ' />
      <CardContent className='flex-1'>
        <div className='flex flex-col items-center h-full align-middle'>
          <div className='flex-1 flex items-center'>
            <p className='text-3xl font-bold'>
              <span className='text-green-500'>{wins + ' W '}</span>
              /
              <span className='text-red-500'>{' ' + losses + ' L'}</span>
            </p>
          </div>
          
          <p className='text-md'>{`${wins + losses} total encounters`}</p>
          
        </div>
      </CardContent>
      
      
      
    </Card>
  )
}

export default AncientStatsCard;