import { useMemo, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
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
  Collapsible,
  Dialog,
  HStack,
  IconButton,
  Pagination,
  Select,
  Table,
  TextInput,
  MultiSelect,
} from '@vapor-ui/core';
import {
  ChevronRightOutlineIcon,
  CloseOutlineIcon,
  PlusOutlineIcon,
  SearchOutlineIcon,
  ArrowDownOutlineIcon,
  ArrowUpOutlineIcon,
} from '@vapor-ui/icons';
import type { Product, ProductFormData } from '../../types';
import { MOCK_PRODUCTS } from '../../mocks/mockProducts';
import { toastManager } from '../../lib/toastManager';

// 상수
const CATEGORIES = ['전체', '식품', '생필품', '전자제품'];

const CATEGORY_ITEMS = CATEGORIES.filter((c) => c !== '전체').map((c) => ({
  label: c,
  value: c,
}));

const CATEGORY_COLOR: Record<
  string,
  'primary' | 'success' | 'warning' | 'danger' | 'hint' | 'contrast'
> = {
  식품: 'success',
  생필품: 'danger',
  전자제품: 'primary',
};

const EMPTY_FORM: ProductFormData = {
  product_name: '',
  product_price: 0,
  product_category: '',
  stock: 0,
  product_description: '',
};

// 커스텀 필터 함수
function categoryFilterFn(
  row: Row<Product>,
  columnId: string,
  filterValue: any,
) {
  if (!filterValue || filterValue.length === 0) return true;
  const cellValue = row.getValue(columnId) as string;
  return filterValue.includes(cellValue);
}

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
        {CATEGORY_ITEMS.map((item) => (
          <MultiSelect.Item key={item.value} value={item.value}>
            {item.label}{' '}
          </MultiSelect.Item>
        ))}
      </MultiSelect.Popup>
    </MultiSelect.Root>
  );
}

// 컴포넌트
export default function ProductsManagePage() {
  // 상품 목록
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // 정렬
  const [sorting, setSorting] = useState<SortingState>([]);

  // 컬럼 필터 (검색 + 카테고리)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 인라인 수정
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<ProductFormData>(EMPTY_FORM);

  // 상품 추가 폼
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductFormData>(EMPTY_FORM);

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  // 펼침 행
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 확인 다이얼로그
  const [dialog, setDialog] = useState<{
    type: 'add' | 'edit' | 'delete';
    targetId?: number;
  } | null>(null);

  // 유효성 검사
  const validateForm = (form: ProductFormData): string | null => {
    if (!form.product_name.trim()) return '상품명을 입력해주세요.';
    if (form.product_price <= 0) return '가격은 0보다 커야 합니다.';
    if (!form.product_category) return '카테고리를 선택해주세요.';
    if (form.stock < 0) return '재고는 0 이상이어야 합니다.';
    return null;
  };

  // 인라인 수정
  const handleEditStart = (product: Product) => {
    setEditingId(product.id);
    setEditingData({
      product_name: product.product_name,
      product_price: product.product_price,
      product_category: product.product_category,
      stock: product.stock,
      product_description: product.product_description,
    });
    setExpandedRows((prev) => new Set(prev).add(product.id));
  };

  const handleEditCancel = () => setEditingId(null);

  // 다이얼로그 오픈
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

  const handleAddClick = () => {
    const error = validateForm(newProduct);
    if (error) {
      toastManager.add({ title: error, colorPalette: 'danger' });
      return;
    }
    setDialog({ type: 'add' });
  };

  // 다이얼로그 확인
  const handleConfirm = () => {
    if (!dialog) return;

    if (dialog.type === 'delete' && dialog.targetId !== undefined) {
      setProducts((prev) => prev.filter((p) => p.id !== dialog.targetId));
      toastManager.add({
        title: '상품이 삭제되었습니다.',
        colorPalette: 'success',
      });
    }

    if (dialog.type === 'edit' && dialog.targetId !== undefined) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === dialog.targetId ? { ...p, ...editingData } : p,
        ),
      );
      setEditingId(null);
      toastManager.add({
        title: '상품 정보가 수정되었습니다.',
        colorPalette: 'success',
      });
    }

    if (dialog.type === 'add') {
      const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts((prev) => [...prev, { id: newId, ...newProduct }]);
      setNewProduct(EMPTY_FORM);
      setShowAddForm(false);
      toastManager.add({
        title: '상품이 추가되었습니다.',
        colorPalette: 'success',
      });
    }

    setDialog(null);
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <ChevronRightOutlineIcon
              size='14px'
              style={{
                transform: expandedRows.has(row.original.id)
                  ? 'rotate(90deg)'
                  : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
            <span className='text-gray-500'>{row.original.id}</span>
          </div>
        ),
      },
      {
        header: '상품명',
        accessorKey: 'product_name',
        enableSorting: true,
        filterFn: 'includesString',
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <input
              value={editingData.product_name}
              onChange={(e) =>
                setEditingData((prev) => ({
                  ...prev,
                  product_name: e.target.value,
                }))
              }
              className='border border-gray-300 rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          ) : (
            <span className='font-medium'>{row.original.product_name}</span>
          ),
      },
      {
        header: '가격',
        accessorKey: 'product_price',
        enableSorting: true,
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <input
              type='number'
              min={1}
              value={editingData.product_price || ''}
              onChange={(e) =>
                setEditingData((prev) => ({
                  ...prev,
                  product_price: Number(e.target.value),
                }))
              }
              className='border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            />
          ) : (
            row.original.product_price.toLocaleString() + '원'
          ),
      },
      {
        header: '카테고리',
        accessorKey: 'product_category',
        enableSorting: true,
        filterFn: categoryFilterFn,
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <Select.Root
              placeholder='선택'
              items={CATEGORY_ITEMS}
              value={editingData.product_category}
              onValueChange={(value) =>
                setEditingData((prev) => ({
                  ...prev,
                  product_category: value as string,
                }))
              }
              size='md'
            >
              <Select.Trigger />
              <Select.Popup>
                {CATEGORY_ITEMS.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}{' '}
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Root>
          ) : (
            <Badge
              colorPalette={
                CATEGORY_COLOR[row.original.product_category] ?? 'hint'
              }
              shape='square'
              size='sm'
            >
              {row.original.product_category}
            </Badge>
          ),
      },
      {
        header: '재고',
        accessorKey: 'stock',
        enableSorting: true,
        cell: ({ row }) =>
          editingId === row.original.id ? (
            <input
              type='number'
              min={0}
              value={editingData.stock || ''}
              onChange={(e) =>
                setEditingData((prev) => ({
                  ...prev,
                  stock: Number(e.target.value),
                }))
              }
              className='border border-gray-300 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            />
          ) : (
            row.original.stock
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
    [editingId, editingData, expandedRows],
  );

  const table = useReactTable({
    data: products,
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
      <h1 className='text-2xl font-bold mb-6'>상품 관리</h1>

      {/* 테이블 */}
      <Card.Root>
        <Card.Header>
          <HStack
            $css={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span className='text-lg font-semibold text-gray-700 shrink-0'>
              상품 목록
            </span>

            <HStack $css={{ alignItems: 'center', gap: '$100' }}>
              {/* 검색 */}
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
                  placeholder='상품명 검색'
                  $css={{
                    border: 'none',
                    paddingInline: '$000',
                    flex: 1,
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  onValueChange={(value) =>
                    table.getColumn('product_name')?.setFilterValue(value)
                  }
                />
              </HStack>

              {/* 카테고리 필터 */}
              <div className='w-50'>
                <FilterSelect
                  triggerLabel='카테고리'
                  items={CATEGORY_ITEMS}
                  value={categoryFilter}
                  size='md'
                  onValueChange={(value) => {
                    setCategoryFilter(value as string[]);
                    table.getColumn('product_category')?.setFilterValue(value);
                  }}
                />
              </div>

              {/* 상품 추가 버튼 */}
              <button
                onClick={() => setShowAddForm(true)}
                className='h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap'
              >
                <PlusOutlineIcon size='16px' />
                상품 추가
              </button>
            </HStack>
          </HStack>
        </Card.Header>
        {/* 상품 추가 폼 */}
        {showAddForm && (
          <div className='w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-4 items-end'>
            <label className='flex flex-col gap-1 text-sm w-40'>
              <span className='text-gray-600 font-medium'>상품명</span>
              <input
                placeholder='상품명'
                type='text'
                value={newProduct.product_name}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    product_name: e.target.value,
                  }))
                }
                className='border border-gray-300 rounded px-2 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-gray-400'
              />
            </label>
            <label className='flex flex-col gap-1 text-sm w-32'>
              <span className='text-gray-600 font-medium'>가격</span>
              <input
                type='number'
                placeholder='0'
                min={1}
                value={newProduct.product_price || ''}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    product_price: Number(e.target.value),
                  }))
                }
                className='border border-gray-300 rounded px-2 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
            </label>
            <label className='flex flex-col gap-1 text-sm w-32'>
              <span className='text-gray-600 font-medium'>카테고리</span>
              <Select.Root
                placeholder='선택'
                items={CATEGORY_ITEMS}
                value={newProduct.product_category}
                onValueChange={(value) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    product_category: value as string,
                  }))
                }
                size='md'
              >
                <Select.Trigger />
                <Select.Popup>
                  {CATEGORY_ITEMS.map((item) => (
                    <Select.Item key={item.value} value={item.value}>
                      {item.label}{' '}
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Root>
            </label>
            <label className='flex flex-col gap-1 text-sm w-24'>
              <span className='text-gray-600 font-medium'>재고</span>
              <input
                type='number'
                min={0}
                placeholder='0'
                value={newProduct.stock || ''}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    stock: Number(e.target.value),
                  }))
                }
                className='border border-gray-300 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
            </label>
            <label className='flex flex-col gap-1 text-sm flex-1 min-w-48'>
              <span className='text-gray-600 font-medium'>상품설명</span>
              <textarea
                placeholder='상품 설명을 입력하세요'
                rows={2}
                value={newProduct.product_description}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    product_description: e.target.value,
                  }))
                }
                className='border border-gray-300 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400'
              />
            </label>
            <button
              onClick={handleAddClick}
              className='px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors cursor-pointer'
            >
              추가
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className='px-4 py-1.5 text-sm rounded cursor-pointer flex items-center gap-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
            >
              취소
            </button>
          </div>
        )}
        <Card.Body $css={{ overflow: 'auto', padding: '$000' }}>
          <Table.Root $css={{ width: '100%', tableLayout: 'fixed' }}>
            <Table.ColumnGroup>
              <Table.Column width='10%' /> {/* ID */}
              <Table.Column width='26%' /> {/* 상품명 */}
              <Table.Column width='16%' /> {/* 가격 */}
              <Table.Column width='16%' /> {/* 카테고리 */}
              <Table.Column width='12%' /> {/* 재고 */}
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
                  <>
                    <Table.Row
                      key={row.id}
                      $css={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).closest(
                            'button, input, textarea, [role="combobox"], [role="option"], [role="listbox"]',
                          )
                        )
                          return;
                        toggleExpand(row.original.id);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                    <Table.Row key={`${row.id}-desc`}>
                      <Table.Cell
                        colSpan={columns.length}
                        $css={{ padding: '$000' }}
                      >
                        <Collapsible.Root
                          open={expandedRows.has(row.original.id)}
                        >
                          <Collapsible.Panel>
                            <div className='flex flex-col gap-1 px-4 py-3 bg-gray-50 border-t border-gray-100'>
                              <span className='text-xs font-medium text-gray-500'>
                                상품설명
                              </span>
                              {editingId === row.original.id ? (
                                <textarea
                                  value={editingData.product_description}
                                  onChange={(e) =>
                                    setEditingData((prev) => ({
                                      ...prev,
                                      product_description: e.target.value,
                                    }))
                                  }
                                  rows={2}
                                  className='border border-gray-300 rounded px-2 py-1 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
                                />
                              ) : (
                                <span className='text-sm text-gray-700'>
                                  {row.original.product_description}
                                </span>
                              )}
                            </div>
                          </Collapsible.Panel>
                        </Collapsible.Root>
                      </Table.Cell>
                    </Table.Row>
                  </>
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
            {/* 총 상품 수 */}
            <span className='absolute left-6 text-sm text-gray-500'>
              총 {table.getFilteredRowModel().rows.length}개{' '}
              {table.getFilteredRowModel().rows.length !== products.length && (
                <span className='text-gray-400'>
                  {' '}
                  (전체 {products.length}개)
                </span>
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
              {dialog?.type === 'delete' && '상품 삭제'}
              {dialog?.type === 'edit' && '상품 수정'}
              {dialog?.type === 'add' && '상품 추가'}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              {dialog?.type === 'delete' &&
                '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
              {dialog?.type === 'edit' && '상품 정보를 수정하시겠습니까?'}
              {dialog?.type === 'add' && '새 상품을 추가하시겠습니까?'}
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
