import MessagesWidget from '../widgets/MessagesWidget';

/**
 * Right panel (≈28% width). Contains Messages widget.
 * In RTL layout, this is the 1st DOM element → appears on the RIGHT visually.
 */
export default function RightPanel() {
  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-y-auto">
      <MessagesWidget />
    </div>
  );
}
