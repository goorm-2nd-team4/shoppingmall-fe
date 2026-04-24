import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductsManagePage from './ProductsManagePage';
import { productAPI } from '../../api/index';
import { toastManager } from '../../lib/toastManager';

vi.mock('../../api/index', () => ({
  productAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../lib/toastManager', () => ({
  toastManager: { add: vi.fn() },
}));

const mockProducts = [
  {
    id: 1,
    product_name: '사과',
    product_price: 3000,
    product_category: '식품',
    product_detail: '신선한 사과',
    stock: 100,
  },
  {
    id: 2,
    product_name: '노트북',
    product_price: 1500000,
    product_category: '전자제품',
    product_detail: '고성능 노트북',
    stock: 10,
  },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProductsManagePage />
    </MemoryRouter>,
  );

describe('ProductsManagePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로딩 중 "불러오는 중..." 표시', () => {
    vi.mocked(productAPI.getAll).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('상품 목록 렌더링', async () => {
    vi.mocked(productAPI.getAll).mockResolvedValue({
      data: { data: mockProducts },
    } as any);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('사과')).toBeInTheDocument();
      expect(screen.getByText('노트북')).toBeInTheDocument();
    });
  });

  it('API 실패 시 에러 toast 표시', async () => {
    vi.mocked(productAPI.getAll).mockRejectedValue(new Error('Network Error'));
    renderPage();
    await waitFor(() => {
      expect(vi.mocked(toastManager.add)).toHaveBeenCalledWith(
        expect.objectContaining({ colorPalette: 'danger' }),
      );
    });
  });

  it('상품명 검색 시 해당 상품만 표시', async () => {
    vi.mocked(productAPI.getAll).mockResolvedValue({
      data: { data: mockProducts },
    } as any);
    renderPage();
    await waitFor(() => expect(screen.getByText('사과')).toBeInTheDocument());

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('상품명 검색'), '노트북');

    await waitFor(() => {
      expect(screen.getByText('노트북')).toBeInTheDocument();
      expect(screen.queryByText('사과')).not.toBeInTheDocument();
    });
  });

  it('상품 추가 버튼 클릭 시 폼 열림', async () => {
    vi.mocked(productAPI.getAll).mockResolvedValue({
      data: { data: [] },
    } as any);
    renderPage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /상품 추가/ }));

    expect(screen.getByPlaceholderText('상품명')).toBeInTheDocument();
  });

  it('상품 추가 폼 취소 시 폼 닫힘', async () => {
    vi.mocked(productAPI.getAll).mockResolvedValue({
      data: { data: [] },
    } as any);
    renderPage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /상품 추가/ }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.queryByPlaceholderText('상품명')).not.toBeInTheDocument();
  });

  it('상품 추가 폼 빈 값 제출 시 유효성 toast 표시', async () => {
    vi.mocked(productAPI.getAll).mockResolvedValue({
      data: { data: [] },
    } as any);
    renderPage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /상품 추가/ }));
    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(vi.mocked(toastManager.add)).toHaveBeenCalledWith(
      expect.objectContaining({ colorPalette: 'danger' }),
    );
    expect(vi.mocked(productAPI.create)).not.toHaveBeenCalled();
  });

  it('삭제 확인 시 API 호출', async () => {
    vi.mocked(productAPI.getAll).mockResolvedValue({
      data: { data: mockProducts },
    } as any);
    vi.mocked(productAPI.delete).mockResolvedValue({ data: {} } as any);
    renderPage();
    await waitFor(() =>
      expect(
        screen.getAllByRole('button', { name: '삭제' })[0],
      ).toBeInTheDocument(),
    );

    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: '삭제' })[0]);
    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(vi.mocked(productAPI.delete)).toHaveBeenCalled();
    });
  });
});
