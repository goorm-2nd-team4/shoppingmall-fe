import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MembersManagePage from './MembersManagePage';
import { adminMemberAPI } from '../../api/index';
import { toastManager } from '../../lib/toastManager';

vi.mock('../../api/index', () => ({
  adminMemberAPI: {
    getAll: vi.fn(),
    updateRole: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../lib/toastManager', () => ({
  toastManager: { add: vi.fn() },
}));

const mockMembers = [
  { id: 1, email: 'admin@test.com', name: '관리자', role: 'ADMIN' },
  { id: 2, email: 'user@test.com', name: '홍길동', role: 'USER' },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <MembersManagePage />
    </MemoryRouter>,
  );

describe('MembersManagePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로딩 중 "불러오는 중..." 표시', () => {
    vi.mocked(adminMemberAPI.getAll).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('사용자 목록 렌더링', async () => {
    vi.mocked(adminMemberAPI.getAll).mockResolvedValue({
      data: { data: { members: mockMembers, totalCount: 2, adminCount: 1 } },
    } as any);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });
  });

  it('API 실패 시 에러 toast 표시', async () => {
    vi.mocked(adminMemberAPI.getAll).mockRejectedValue(
      new Error('Network Error'),
    );
    renderPage();
    await waitFor(() => {
      expect(vi.mocked(toastManager.add)).toHaveBeenCalledWith(
        expect.objectContaining({ colorPalette: 'danger' }),
      );
    });
  });

  it('이름 검색 시 해당 사용자만 표시', async () => {
    vi.mocked(adminMemberAPI.getAll).mockResolvedValue({
      data: { data: { members: mockMembers, totalCount: 2, adminCount: 1 } },
    } as any);
    renderPage();
    await waitFor(() => expect(screen.getByText('홍길동')).toBeInTheDocument());

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('이름 검색'), '관리자');

    await waitFor(() => {
      expect(screen.getByText('관리자')).toBeInTheDocument();
      expect(screen.queryByText('홍길동')).not.toBeInTheDocument();
    });
  });

  it('삭제 확인 시 API 호출', async () => {
    vi.mocked(adminMemberAPI.getAll).mockResolvedValue({
      data: { data: { members: mockMembers, totalCount: 2, adminCount: 1 } },
    } as any);
    vi.mocked(adminMemberAPI.delete).mockResolvedValue({ data: {} } as any);
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
      expect(vi.mocked(adminMemberAPI.delete)).toHaveBeenCalled();
    });
  });

  it('역할 수정 확인 시 API 호출', async () => {
    vi.mocked(adminMemberAPI.getAll).mockResolvedValue({
      data: { data: { members: mockMembers, totalCount: 2, adminCount: 1 } },
    } as any);
    vi.mocked(adminMemberAPI.updateRole).mockResolvedValue({ data: {} } as any);
    renderPage();
    await waitFor(() =>
      expect(
        screen.getAllByRole('button', { name: '수정' })[0],
      ).toBeInTheDocument(),
    );

    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: '수정' })[0]);
    await user.click(screen.getByRole('button', { name: '저장' }));
    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(vi.mocked(adminMemberAPI.updateRole)).toHaveBeenCalled();
    });
  });
});
