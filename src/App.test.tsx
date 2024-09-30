import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import 'jest';
import jest from 'jest-mock';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
    test('renders Iframe with correct URL when setlist is fetched', async () => {
        const mockSetlist = {
            artist_name: 'Test Artist',
            event_date: new Date(),
            location: 'Test Location',
            venue: 'Test Venue',
            tour_name: 'Test Tour',
            songs: [],
            setlist_id: 'test-setlist-id',
        };

        mockedAxios.get.mockResolvedValueOnce({ data: mockSetlist });

        render(<App />);

        // サイトを選択
        fireEvent.change(screen.getByPlaceholderText('サイトを選択'), { target: { value: 'SetlistFM' } });

        // URLを入力
        fireEvent.change(screen.getByPlaceholderText('SetlistFM'), { target: { value: 'https://www.setlist.fm/setlist/test-artist/test-venue/test-setlist-id.html' } });

        // ボタンをクリック
        fireEvent.click(screen.getByText('プレイリストを作成'));

        // Iframeが正しいURLで表示されることを確認
        await waitFor(() => {
            expect(screen.getByTitle('Spotify')).toHaveAttribute('src', 'https://open.spotify.com/embed/playlist/test-setlist-id');
        });
    });
});