/* eslint-disable max-len */
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.all);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const onFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as FilterType);
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const queryCleaner = () => {
    setQuery('');
  };

  const onTodoSelect = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const onSelectedTodoClear = () => {
    setSelectedTodo(null);
  };

  const filteredTodos = useMemo(() => {
    const filtered = getFilteredTodos(todos, filter);

    if (query) {
      return filtered.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase().trimStart()),
      );
    }

    return filtered;
  }, [filter, query, todos]);

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filterBy={filter}
                setFilter={onFilterChange}
                query={query}
                setQuery={onQueryChange}
                cleaner={queryCleaner}
              />
            </div>

            {loading ? (
              <Loader />
            ) : (
              <div className="block">
                <TodoList
                  todos={filteredTodos}
                  selectedTodo={selectedTodo}
                  onSelectedTodo={onTodoSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onTodoClear={onSelectedTodoClear} />
      )}
    </>
  );
};
