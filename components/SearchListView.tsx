import SearchListItem from '@/components/SearchListItem';

interface SearchListViewProps {
  results: any[];
}

export default function SearchListView({ results }: SearchListViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8">
      {results.map((item: any) => (
        <SearchListItem key={item.slug} item={item} />
      ))}
    </div>
  );
}
