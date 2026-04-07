import { useEffect, useState } from 'react';

type TaskSearchProps = {
  onSearch: (value: string) => void;
};

export default function TaskSearch({ onSearch }: TaskSearchProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="task-search mb-3">
      <input
        type="text"
        placeholder="Search by id, description or status..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="form-control"
        aria-label="Search tasks"
      />
    </div>
  );
}