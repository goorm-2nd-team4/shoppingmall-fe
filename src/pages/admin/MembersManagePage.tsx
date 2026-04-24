import { useMemo, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Badge,
  Card,
  Dialog,
  HStack,
  Pagination,
  Select,
  Table,
  TextInput,
  MultiSelect,
} from '@vapor-ui/core';
import {
  SearchOutlineIcon,
  ArrowDownOutlineIcon,
  ArrowUpOutlineIcon,
} from '@vapor-ui/icons';
import type { User } from '../../types';
import { MOCK_USERS } from '../../mocks/mockUsers';
import { toastManager } from '../../lib/toastManager';

// 상수
const ROLES = ['USER', 'ADMIN'] as const;

const ROLE_ITEMS = ROLES.map((r) => ({ label: r, value: r }));

const ROLE_COLOR: Record<
  string,
  'primary' | 'success' | 'warning' | 'danger' | 'hint' | 'contrast'
> = {
  ADMIN: 'primary',
  USER: 'hint',
};

interface UserFormData {
  user_name: string;
  user_role: 'USER' | 'ADMIN';
}

const EMPTY_FORM: UserFormData = {
  user_name: '',
  user_role: 'USER',
};

interface FilterSelectProps extends React.ComponentProps<
  typeof MultiSelect.Root
> {
  triggerLabel: string;
}

function FilterSelect({ triggerLabel, ...props }: FilterSelectProps) {
  return (
    <MultiSelect.Root placeholder={triggerLabel} {...props}>
      <MultiSelect.Trigger />
      <MultiSelect.Popup>
        {ROLE_ITEMS.map((item) => (
          <MultiSelect.Item key={item.value} value={item.value}>
            {item.label}
          </MultiSelect.Item>
        ))}
      </MultiSelect.Popup>
    </MultiSelect.Root>
  );
}

export default function MembersManagePage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  // 인라인 수정
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<UserFormData>(EMPTY_FORM);

  // 확인 다이얼로그
  const [dialog, setDialog] = useState<{
    type: 'edit' | 'delete';
    targetId?: number;
  } | null>(null);

  // 유효성 검사
  const validateForm = (form: UserFormData): string | null => {
    if (!form.user_name.trim()) return '이름을 입력해주세요.';
    return null;
  };

  const handleEditStart = (user: User) => {
    setEditingId(user.id);
    setEditingData({
      user_name: user.user_name,
      user_role: user.user_role,
    });
  };

  const handleEditCancel = () => setEditingId(null);

  const handleEditSaveClick = (id: number) => {
    const error = validateForm(editingData);
    if (error) {
      toastManager.add({ title: error, colorPalette: 'danger' });
      return;
    }
    setDialog({ type: 'edit', targetId: id });
  };

  const handleDeleteClick = (id: number) => {
    setDialog({ type: 'delete', targetId: id });
  };

  const handleConfirm = () => {
    if (!dialog) return;

    if (dialog.type === 'delete' && dialog.targetId !== undefined) {
      setUsers((prev) => prev.filter((u) => u.id !== dialog.targetId));
      toastManager.add({
        title: '사용자가 삭제되었습니다.',
        colorPalette: 'success',
      });
    }

    if (dialog.type === 'edit' && dialog.targetId !== undefined) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === dialog.targetId ? { ...u, ...editingData } : u,
        ),
      );
      setEditingId(null);
      toastManager.add({
        title: '사용자 정보가 수정되었습니다.',
        colorPalette: 'success',
      });
    }

    setDialog(null);
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        enableSorting: true,
        cell: ({ row }) => (
          <span className='text-gray-500'>{row.original.id}</span>
        ),
      },
      {
        header: '이름',
        accessorKey: 'user_name',
        enableSorting: true,
        filterFn: 'includesString',
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <input
              value={editingData.user_name}
              onChange={(e) =>
                setEditingData((prev) => ({
                  ...prev,
                  user_name: e.target.value,
                }))
              }
              className='border border-gray-300 rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          ) : (
            <span className='font-medium'>{row.original.user_name}</span>
          ),
      },
      {
        header: '이메일',
        accessorKey: 'user_email',
        enableSorting: true,
        filterFn: 'includesString',
        cell: ({ row }) => (
          <span className='text-gray-600'>{row.original.user_email}</span>
        ),
      },
      {
        header: '역할',
        accessorKey: 'user_role',
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <Select.Root
              placeholder='선택'
              items={ROLE_ITEMS}
              value={editingData.user_role}
              onValueChange={(value) =>
                setEditingData((prev) => ({
                  ...prev,
                  user_role: value as 'USER' | 'ADMIN',
                }))
              }
              size='md'
            >
              <Select.Trigger />
              <Select.Popup>
                {ROLE_ITEMS.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Root>
          ) : (
            <Badge
              colorPalette={ROLE_COLOR[row.original.user_role] ?? 'hint'}
              shape='square'
              size='sm'
            >
              {row.original.user_role}
            </Badge>
          ),
      },
      {
        id: 'actions',
        header: '작업',
        enableSorting: false,
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <div className='flex gap-2'>
              <button
                onClick={() => handleEditSaveClick(row.original.id)}
                className='px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer'
              >
                저장
              </button>
              <button
                onClick={handleEditCancel}
                className='px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer'
              >
                취소
              </button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <button
                onClick={() => handleEditStart(row.original)}
                className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer'
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteClick(row.original.id)}
                className='px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors cursor-pointer'
              >
                삭제
              </button>
            </div>
          ),
      },
    ],
    [editingId, editingData],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: { pageSize: 10 },
    },
    sortDescFirst: false,
  });

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>사용자 관리</h1>

      <Card.Root>
        <Card.Header>
          <HStack
            $css={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span className='text-lg font-semibold text-gray-700 shrink-0'>
              사용자 목록
            </span>

            <HStack $css={{ alignItems: 'center', gap: '$100' }}>
              {/* 이름 검색 */}
              <HStack
                $css={{
                  alignItems: 'center',
                  gap: '10px',
                  paddingLeft: '$150',
                  border: '1px solid',
                  borderColor: '$normal',
                  borderRadius: '$300',
                  width: '220px',
                }}
              >
                <SearchOutlineIcon />
                <TextInput
                  placeholder='이름 검색'
                  $css={{
                    border: 'none',
                    paddingInline: '$000',
                    flex: 1,
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  onValueChange={(value) =>
                    table.getColumn('user_name')?.setFilterValue(value)
                  }
                />
              </HStack>

              {/* 역할 필터 */}
              <div className='w-40'>
                <FilterSelect
                  triggerLabel='역할'
                  items={ROLE_ITEMS}
                  value={roleFilter}
                  size='md'
                  onValueChange={(value) => {
                    setRoleFilter(value as string[]);
                    table.getColumn('user_role')?.setFilterValue(value);
                  }}
                />
              </div>
            </HStack>
          </HStack>
        </Card.Header>

        <Card.Body $css={{ overflow: 'auto', padding: '$000' }}>
          <Table.Root $css={{ width: '100%', tableLayout: 'fixed' }}>
            <Table.ColumnGroup>
              <Table.Column width='10%' /> {/* ID */}
              <Table.Column width='20%' /> {/* 이름 */}
              <Table.Column width='36%' /> {/* 이메일 */}
              <Table.Column width='14%' /> {/* 역할 */}
              <Table.Column width='20%' /> {/* 작업 */}
            </Table.ColumnGroup>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row
                  key={headerGroup.id}
                  $css={{ backgroundColor: '$basic-gray-050' }}
                >
                  {headerGroup.headers.map((header) => (
                    <Table.Heading
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      $css={{
                        cursor: header.column.getCanSort()
                          ? 'pointer'
                          : 'default',
                        userSelect: 'none',
                      }}
                    >
                      <HStack $css={{ gap: '$050', alignItems: 'center' }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() &&
                          (header.column.getIsSorted() === 'asc' ? (
                            <ArrowDownOutlineIcon />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ArrowUpOutlineIcon />
                          ) : (
                            <ArrowDownOutlineIcon color='none' />
                          ))}
                      </HStack>
                    </Table.Heading>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>

            <Table.Body>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell
                    colSpan={columns.length}
                    $css={{ textAlign: 'center', height: '200px' }}
                  >
                    검색 결과가 없습니다.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>

          {/* 페이지네이션 */}
          <Card.Footer
            $css={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span className='absolute left-6 text-sm text-gray-500'>
              총 {table.getFilteredRowModel().rows.length}명{' '}
              {table.getFilteredRowModel().rows.length !== users.length && (
                <span className='text-gray-400'>(전체 {users.length}명)</span>
              )}
            </span>

            <Pagination.Root
              totalPages={table.getPageCount()}
              page={table.getState().pagination.pageIndex + 1}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            >
              <Pagination.Previous />
              <Pagination.Items />
              <Pagination.Next />
            </Pagination.Root>

            <Select.Root
              value={table.getState().pagination.pageSize}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <Select.TriggerPrimitive
                $css={{ position: 'absolute' }}
                style={{ right: 24, top: '50%', transform: 'translateY(-50%)' }}
              >
                <Select.ValuePrimitive>
                  {(value) => `${value}개씩 보기`}
                </Select.ValuePrimitive>
                <Select.TriggerIconPrimitive />
              </Select.TriggerPrimitive>
              <Select.Popup>
                {[5, 10, 20, 30].map((size) => (
                  <Select.Item key={size} value={size}>
                    {size}
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Root>
          </Card.Footer>
        </Card.Body>
      </Card.Root>

      {/* 확인 Dialog */}
      <Dialog.Root
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>
              {dialog?.type === 'delete' && '사용자 삭제'}
              {dialog?.type === 'edit' && '사용자 수정'}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              {dialog?.type === 'delete' &&
                '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
              {dialog?.type === 'edit' && '사용자 정보를 수정하시겠습니까?'}
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer style={{ marginLeft: 'auto' }}>
            <Dialog.Close
              render={
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-1.5 text-sm rounded text-white cursor-pointer mx-1 ${
                    dialog?.type === 'delete'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  확인
                </button>
              }
            />
            <Dialog.Close
              render={
                <button className='px-4 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100 cursor-pointer'>
                  취소
                </button>
              }
            />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Root>
    </div>
  );
}
